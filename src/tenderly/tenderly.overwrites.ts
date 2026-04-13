import { ChainId, ErrorCode } from '@lifi/types'
import { ethers } from 'ethers'
import memoizee from 'memoizee'

import { logger } from '@tenderlysim/logger'
import { LifiError } from '@tenderlysim/common'

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

const extractStates = (
  contract: Awaited<ReturnType<typeof getPublicTokenContract>>
): State[] | undefined => contract?.data?.states

const _getContractStates =
  (tenderlyConfig: TenderlyConfig) =>
  async (
    chainId: ChainId,
    tokenAddress: string
  ): Promise<State[] | undefined> => {
    const publicStates = extractStates(
      await getPublicTokenContract(chainId, tokenAddress)
    )
    if (publicStates !== undefined) {
      return publicStates
    }

    return extractStates(
      await getTokenContract(tenderlyConfig)(chainId, tokenAddress)
    )
  }

const getContractStates = memoizee(_getContractStates, {
  promise: true,
  maxAge: 60 * 60 * 1000, // 1h
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
    if (params.tokenAddress === ethers.ZeroAddress) {
      return {}
    }

    const tokenImplementationAddress = getImplementationAddress(
      params.chainId,
      params.tokenAddress.toLowerCase() as Lowercase<string>
    )

    const contractStates = await getContractStates(tenderlyConfig)(
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
