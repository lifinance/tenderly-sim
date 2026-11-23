import { ChainId, ErrorCode } from '@lifi/types'
import { LifiError } from '@tenderlysim/common'
import { logger } from '@tenderlysim/logger'
import memoizee from 'memoizee'

import {
  encodeContractStates,
  getPublicTokenContract,
  getTokenContract,
} from './tenderly.api'
import {
  TenderlyConfig,
  knownAllowanceMappings,
  knownBalanceMappings,
  knownProxyTokens,
} from './tenderly.config'
import { State } from './tenderly.types.contract'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const extractStates = (
  contract: Awaited<ReturnType<typeof getPublicTokenContract>>
): State[] | undefined => contract?.data?.states

// Rejects when no states are found, so the caller can evict the failed entry
// and the next call retries instead of reusing the failure for 1h.
const fetchContractStates = async (
  tenderlyConfig: TenderlyConfig,
  chainId: ChainId,
  tokenAddress: string
): Promise<State[]> => {
  const states =
    extractStates(await getPublicTokenContract(chainId, tokenAddress)) ??
    extractStates(await getTokenContract(tenderlyConfig)(chainId, tokenAddress))
  if (states === undefined) {
    throw new Error(`No contract states for ${chainId}/${tokenAddress}`)
  }
  return states
}

const cachedContractStates = memoizee(fetchContractStates, {
  promise: true,
  maxAge: 60 * 60 * 1000, // 1h
  max: 1000, // least recently used entries are dropped beyond this
  // Key on values, not on the config object's identity. The access key is part
  // of the key so one credential's failed project lookup never fails another's.
  normalizer: ([{ accessKey, user, project }, chainId, tokenAddress]) =>
    JSON.stringify([accessKey, user, project, chainId, tokenAddress]),
})

const getContractStates = (
  tenderlyConfig: TenderlyConfig,
  chainId: ChainId,
  tokenAddress: string
): Promise<State[] | undefined> =>
  cachedContractStates(tenderlyConfig, chainId, tokenAddress).catch(() => {
    // memoizee only evicts a rejected entry on the next tick; evict it now so
    // an immediate retry makes a new request.
    cachedContractStates.delete(tenderlyConfig, chainId, tokenAddress)
    return undefined
  })

const getApprovalMapping = (
  tokenImplementationAddress: string,
  tokenStates: State[],
  params: {
    ownerAddress: string
    spenderAddress: string
    amount: string
  }
) => {
  const mask = tokenStates
    .map(({ type, name }) => {
      if (knownAllowanceMappings[type]?.names.includes(name)) {
        return name + knownAllowanceMappings[type].mask
      }
    })
    .find((mask) => mask)

  if (mask === undefined) {
    logger().warn(
      {
        service: 'getApprovalMapping',
        data: tokenStates,
      },
      `Unknown approval mapping for token ${tokenImplementationAddress}`
    )
    throw LifiError({
      message: `Unable to find matching mapping in knownAllowanceMappings.`,
      code: ErrorCode.NotProcessableError,
    })
  }
  const mapping = mask
    .replace('OWNER_ADDRESS', params.ownerAddress)
    .replace('SPENDER_ADDRESS', params.spenderAddress)

  return {
    [mapping]: params.amount,
  }
}

const getBalanceMapping = (
  tokenImplementationAddress: string,
  tokenStates: State[],
  params: {
    ownerAddress: string
    amount: string
  }
) => {
  const mask = tokenStates
    .map(({ type, name }) => {
      if (knownBalanceMappings[type]?.names.includes(name)) {
        return name + knownBalanceMappings[type].mask
      }
    })
    .find((mask) => mask)

  if (mask === undefined) {
    logger().warn(
      {
        service: 'getBalanaceMapping',
        data: tokenStates,
      },
      `Unknown balance mapping for token ${tokenImplementationAddress}`
    )
    throw LifiError({
      message: `Unable to find matching mapping in knownBalanceMappings.`,
      code: ErrorCode.NotProcessableError,
    })
  }
  const mapping = mask.replace('OWNER_ADDRESS', params.ownerAddress)

  return {
    [mapping]: params.amount,
  }
}

const getImplementationAddress = (
  chainId: number,
  tokenAddress: Lowercase<string>
): Lowercase<string> =>
  knownProxyTokens[chainId]?.[tokenAddress] ?? tokenAddress

export const getTokenOverwrite =
  (tenderlyConfig: TenderlyConfig) =>
  async (params: {
    chainId: number
    tokenAddress: string
    amount: string
    ownerAddress: string
    spenderAddress: string
  }) => {
    if (params.tokenAddress === ZERO_ADDRESS) {
      return {}
    }

    const tokenImplementationAddress = getImplementationAddress(
      params.chainId,
      params.tokenAddress.toLowerCase() as Lowercase<string>
    )

    const contractStates = await getContractStates(
      tenderlyConfig,
      params.chainId,
      tokenImplementationAddress
    )
    if (contractStates === undefined) {
      throw LifiError({
        message: `Unable to find contract states.`,
        code: ErrorCode.ThirdPartyError,
      })
    }

    const approvalMapping = getApprovalMapping(
      tokenImplementationAddress,
      contractStates,
      params
    )
    const balanceMapping = getBalanceMapping(
      tokenImplementationAddress,
      contractStates,
      params
    )
    const rawState: Record<string, string> = ({} = {
      ...approvalMapping,
      ...balanceMapping,
    })

    return encodeContractStates(tenderlyConfig)(
      params.chainId,
      params.tokenAddress,
      tokenImplementationAddress,
      rawState
    )
  }
