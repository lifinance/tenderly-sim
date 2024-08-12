import { LiFiStep } from '@lifi/types'

import { http } from './http'
import { simulate } from './tenderly'
import { TenderlyConfig } from './tenderly/tenderly.config'
import { logger } from './logger'

export const main = async () => {
  const quote = await http()
    .get<LiFiStep>(
      'https://li.quest/v1/quote?fromChain=POL&fromAmount=1000000&fromToken=USDC&fromAddress=0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0&toChain=POL&toToken=DAI&integrator=postman&slippage=0.03'
    )
    .then((q) => q.data)

  const config: TenderlyConfig = {
    accessKey: '---',
    user: 'LiFi',
    project: 'simulate',
  }

  logger().info(quote)
  const sim = await simulate(config)(quote, {
    senderTokenBalanceAndApproval: true,
    senderNativeBalance: false,
  })

  return sim
}

main()
  .then((res) => logger().info(res))
  .catch((err) => logger().error(err))
