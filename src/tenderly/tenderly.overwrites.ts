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

const _getContractStates =
  (tenderlyConfig: TenderlyConfig) =>
  async (
    chainId: ChainId,
    tokenAddress: string
  ): Promise<State[] | undefined> => {
    let tokenContract = await getPublicTokenContract(chainId, tokenAddress)

    // try project contract as fallback
    if (tokenContract?.data?.states === undefined) {
      tokenContract = await getTokenContract(tenderlyConfig)(
        chainId,
        tokenAddress
      )
    }

    return tokenContract?.data?.states
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

    // use proxy implementation if available
    let tokenImplementationAddress =
      params.tokenAddress.toLowerCase() as Lowercase<string>
    if (knownProxyTokens[params.chainId]?.[tokenImplementationAddress]) {
      tokenImplementationAddress =
        knownProxyTokens[params.chainId][tokenImplementationAddress]
    }

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
