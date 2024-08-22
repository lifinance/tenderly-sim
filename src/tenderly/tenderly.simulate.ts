import { ChainId, ErrorCode, TransactionRequest } from '@lifi/types'

import { LifiError } from '@tenderlysim/common'
import { logger } from '@tenderlysim/logger'

import { simulateTransaction } from './tenderly.api'
import {
  TENDERLY_CHAINS,
  TenderlyConfig,
  knownFailingTokens,
} from './tenderly.config'
import { getTokenOverwrite } from './tenderly.overwrites'

// TODO: improve code quality
/* eslint-disable complexity, max-lines-per-function */

const validateTransactionRequest = (
  transactionRequest?: TransactionRequest
) => {
  if (transactionRequest === undefined)
    throw LifiError({
      message: `No transaction request passed`,
      code: ErrorCode.MalformedSchema,
    })
  if (transactionRequest.from === undefined)
    throw LifiError({
      message: `transactionRequest is missing from`,
      code: ErrorCode.MalformedSchema,
    })
  if (transactionRequest.to === undefined)
    throw LifiError({
      message: `transactionRequest is missing to`,
      code: ErrorCode.MalformedSchema,
    })
  if (transactionRequest.chainId === undefined)
    throw LifiError({
      message: `transactionRequest is missing chainId`,
      code: ErrorCode.MalformedSchema,
    })
  if (transactionRequest.data === undefined)
    throw LifiError({
      message: `transactionRequest is missing data`,
      code: ErrorCode.MalformedSchema,
    })
  if (transactionRequest.gasPrice === undefined)
    throw LifiError({
      message: `transactionRequest is missing gasPrice`,
      code: ErrorCode.MalformedSchema,
    })
  if (transactionRequest.gasLimit === undefined)
    throw LifiError({
      message: `transactionRequest is missing gasLimit`,
      code: ErrorCode.MalformedSchema,
    })
  if (transactionRequest.value === undefined)
    throw LifiError({
      message: `transactionRequest is missing value`,
      code: ErrorCode.MalformedSchema,
    })

  return {
    from: transactionRequest.from,
    to: transactionRequest.to,
    chainId: transactionRequest.chainId,
    data: transactionRequest.data,
    gasPrice: transactionRequest.gasPrice,
    gasLimit: transactionRequest.gasLimit,
    value: transactionRequest.value,
  }
}

export const getStateOverwrites =
  (tenderlyConfig: TenderlyConfig) =>
  async (
    overwrites = {
      senderTokenBalanceAndApproval: true,
      senderNativeBalance: true,
    },
    params: {
      chainId: number
      tokenAddress: string
      amount: string
      ownerAddress: string
      spenderAddress: string
    }
  ): Promise<Record<string, string>> => {
    let stateOverwrites: Record<string, any> = {}
    if (overwrites.senderTokenBalanceAndApproval) {
      const tokenOverwrite = await getTokenOverwrite(tenderlyConfig)(params)
      stateOverwrites = {
        ...stateOverwrites,
        ...tokenOverwrite,
      }
    }
    if (overwrites.senderNativeBalance) {
      stateOverwrites = {
        ...stateOverwrites,

        // enough gas + value on sender
        [params.ownerAddress]: {
          balance: '10000000000000000000000000',
        },
      }
    }

    return stateOverwrites
  }

export const simulate =
  (tenderlyConfig: TenderlyConfig) =>
  async (
    quote: {
      fromToken: string
      toToken: string
      fromChain: ChainId
      fromAmount: bigint
      transactionRequest: TransactionRequest
    },
    overwrites = {
      senderTokenBalanceAndApproval: true,
      senderNativeBalance: true,
    }
  ) => {
    // tenderly supported
    if (!TENDERLY_CHAINS.includes(quote.fromChain)) {
      return {
        result: 'IMPOSSIBLE',
        error: 'TENDERLY_UNSUPPORTED_CHAIN',
        link: undefined,
        simulation: undefined,
      }
    }
    // token supported
    if (
      knownFailingTokens[quote.fromChain]?.includes(
        quote.fromToken.toLowerCase() as Lowercase<string>
      )
    ) {
      return {
        result: 'IMPOSSIBLE',
        error: 'TENDERLY_UNSUPPORTED_TOKEN',
        link: undefined,
        simulation: undefined,
      }
    }
    const transactionRequest = validateTransactionRequest(
      quote.transactionRequest
    )

    let stateOverwrites
    try {
      stateOverwrites = await getStateOverwrites(tenderlyConfig)(overwrites, {
        chainId: quote.fromChain,
        tokenAddress: quote.fromToken,
        amount: quote.fromAmount.toString(),
        ownerAddress: transactionRequest.from,
        spenderAddress: transactionRequest.to,
      })
    } catch (e) {
      logger().error(e)
      return {
        result: 'IMPOSSIBLE',
        error: 'MAPPING_MISSING',
        link: undefined,
        simulation: undefined,
      }
    }

    // Overwrite for transactions on specific L2s
    // So we can test the transactions even if the gasLimits the API returns are too low
    if (quote.fromChain === ChainId.ARB) {
      transactionRequest.gasLimit = '20000000'
    }
    if (quote.fromChain === ChainId.MNT) {
      transactionRequest.gasLimit = '' // do not pass a limit
    }

    const data = {
      /* Simulation Configuration */
      save: true, // if true simulation is saved and shows up in the dashboard
      save_if_fails: true, // if true, reverting simulations show up in the dashboard
      simulation_type: 'full', // full or quick (full is default)

      network_id: transactionRequest.chainId.toString(),

      /* Standard EVM Transaction object */
      from: transactionRequest.from,
      input: transactionRequest.data,
      to: transactionRequest.to,
      gas:
        transactionRequest.gasLimit === ''
          ? undefined
          : Number(BigInt(transactionRequest.gasLimit)),
      gas_price: BigInt(transactionRequest.gasPrice).toString(),
      value: BigInt(transactionRequest.value).toString(),

      /* Advanced */
      state_objects: stateOverwrites,
    }

    try {
      const result = await simulateTransaction(tenderlyConfig)(data)
      return {
        result: result.simulation.status ? 'WORKED' : 'FAILED',
        error: result.simulation.status
          ? undefined
          : result.transaction.error_message,
        simulation: result.simulation,
        link: result.link,
      }
    } catch (e) {
      if (e instanceof Error) {
        return {
          result: 'FAILED',
          error: e.message,
        }
      } else {
        return {
          result: 'FAILED',
          error: 'REQUEST_FAILED',
        }
      }
    }
  }
