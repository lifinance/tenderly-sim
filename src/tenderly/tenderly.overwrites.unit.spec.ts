import { setImmediate } from 'node:timers/promises'

import { getTokenOverwrite } from './tenderly.overwrites'

const get = jest.fn()
const post = jest.fn()

jest.mock('@tenderlysim/http', () => ({
  http: () => ({ get, post }),
}))

const states = [
  { name: '_balances', type: 'mapping (address => uint256)' },
  {
    name: '_allowances',
    type: 'mapping (address => mapping (address => uint256))',
  },
]

const overwriteParams = (tokenAddress: string) => ({
  chainId: 1,
  tokenAddress,
  amount: '1',
  ownerAddress: '0xowner',
  spenderAddress: '0xspender',
})

// A new object per call, like consumers that build the config per request.
const config = () => ({ accessKey: 'key', user: 'user', project: 'project' })

describe('getTokenOverwrite', () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
    post.mockImplementation(async (_url, request) => ({
      data: {
        stateOverrides: {
          [Object.keys(request.stateOverrides)[0]]: { value: {} },
        },
      },
    }))
  })

  it('fetches contract states once per token across config objects', async () => {
    get.mockResolvedValue({ data: { data: { states } } })

    await getTokenOverwrite(config())(overwriteParams('0xaaa'))
    await getTokenOverwrite(config())(overwriteParams('0xaaa'))

    expect(get).toHaveBeenCalledTimes(1)
  })

  it('retries the lookup after a failed one instead of caching the failure', async () => {
    get.mockRejectedValue(new Error('network'))
    await expect(
      getTokenOverwrite(config())(overwriteParams('0xbbb'))
    ).rejects.toMatchObject({ message: 'Unable to find contract states.' })
    // public + project endpoint
    expect(get).toHaveBeenCalledTimes(2)

    // memoizee evicts a rejected entry on the next tick.
    await setImmediate()
    get.mockReset()
    get.mockResolvedValue({ data: { data: { states } } })
    await getTokenOverwrite(config())(overwriteParams('0xbbb'))

    expect(get).toHaveBeenCalledTimes(1)
  })
})
