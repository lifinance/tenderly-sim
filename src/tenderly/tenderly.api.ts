import { ChainId, ErrorCode } from '@lifi/types'

import { HttpResponse, http } from '@tenderlysim/http'
import { logger } from '@tenderlysim/logger'
import { LifiError, getErrorMessage } from '@tenderlysim/common'

import {
  TENDERLY_BASE_URL,
  TENDERLY_CHAINS,
  TENDERLY_REQUEST_HEADERS,
  TenderlyConfig,
  projectBaseUrl,
} from './tenderly.config'
import {
  TenderlyContract,
  TenderlyProjectContract,
} from './tenderly.types.contract'
import {
  TenderlySimulationResponse,
  TenderlyTransactionResponse,
} from './tenderly.types'

export const getTokenContract =
  (tenderlyConfig: TenderlyConfig) =>
  async (
    chainId: ChainId,
    tokenAddress: string
  ): Promise<TenderlyContract | undefined> => {
    const url = `${projectBaseUrl(tenderlyConfig)}/contract/${chainId}/${tokenAddress}`
    try {
      const result = await http().get<TenderlyProjectContract>(url, {
        headers: TENDERLY_REQUEST_HEADERS(tenderlyConfig.accessKey),
      })
      return result.data.contract
    } catch (e) {
      logger().warn(`[tenderly] getTokenContract failed ${e}`)
      return undefined
    }
  }

export const getPublicTokenContract = async (
  chainId: ChainId,
  tokenAddress: string
): Promise<TenderlyContract | undefined> => {
  const url = `${TENDERLY_BASE_URL}public-contracts/${chainId}/${tokenAddress}`
  try {
    const result = await http().get<TenderlyContract>(url)
    return result.data
  } catch (e) {
    logger().warn(`[tenderly] getPublicTokenContract failed ${e}`)
    return undefined
  }
}

export const encodeContractStates =
  (tenderlyConfig: TenderlyConfig) =>
  async (
    chainId: ChainId,
    tokenAddress: string,
    tokenImplementationAddress: string,
    mappings: Record<string, string>
  ) => {
    const url = `${projectBaseUrl(tenderlyConfig)}/contracts/encode-states`
    const request = {
      networkID: chainId.toString(),
      stateOverrides: {
        [tokenImplementationAddress]: {
          value: mappings,
        },
      },
    }

    const encodedState = await http()
      .post(url, request, {
        headers: TENDERLY_REQUEST_HEADERS(tenderlyConfig.accessKey),
      })
      .catch((e) => {
        debugger
        throw e
      })

    return {
      [tokenAddress]: {
        storage:
          encodedState.data.stateOverrides[tokenImplementationAddress].value,
      },
    }
  }

export const simulateTransaction =
  (tenderlyConfig: TenderlyConfig) => async (data: any) => {
    const url = `${projectBaseUrl(tenderlyConfig)}/simulate`
    const result = await http().post<TenderlySimulationResponse>(url, data, {
      headers: TENDERLY_REQUEST_HEADERS(tenderlyConfig.accessKey),
    })
    const link = `https://dashboard.tenderly.co/${tenderlyConfig.user}/${tenderlyConfig.project}/simulator/${result.data.simulation.id}`

    return {
      ...result.data,
      link,
    }
  }

const validateTransactionDetailsResponse = (
  response: HttpResponse<TenderlyTransactionResponse>
) => {
  if (response.status === 401) {
    const unauthorizedError = LifiError({
      message: 'Get transaction information call is Unauthorized',
      code: ErrorCode.UnauthorizedError,
    })

    return unauthorizedError
  }

  if (response.status == 404) {
    return LifiError({
      message: 'The tx was not found by Tenderly',
      code: ErrorCode.NotFoundError,
    })
  }

  return response
}

export const getTransactionDetails =
  (tenderlyConfig: TenderlyConfig) =>
  async (
    txHash: string,
    chainId: ChainId
  ): Promise<TenderlyTransactionResponse> => {
    if (!TENDERLY_CHAINS.includes(chainId)) {
      throw LifiError({
        message: 'The requested tx chain is not supported by Tenderly',
        code: ErrorCode.NotProcessableError,
      })
    }

    try {
      const response = await http().get<TenderlyTransactionResponse>(
        `${TENDERLY_BASE_URL}account/${tenderlyConfig.user}/project/${tenderlyConfig.project}/network/${chainId}/transaction/${txHash}`,
        { headers: TENDERLY_REQUEST_HEADERS(tenderlyConfig.accessKey) }
      )

      const validatedResponse = validateTransactionDetailsResponse(response)

      if (validatedResponse instanceof LifiError) throw validatedResponse

      return response.data
    } catch (error) {
      logger().warn(
        `[tenderly] Get transaction information call failed: ${getErrorMessage(
          error
        )}`
      )
      throw LifiError({
        message: 'The getTransactionDetails call failed',
        code: ErrorCode.ThirdPartyError,
      })
    }
  }
