import { ChainId } from '@lifi/types'

import { getTransactionDetails } from './tenderly.api'

beforeAll(() => {
  jest.mock('@tenderlysim/http', () => {
    return {
      http: () => ({
        get: (url: string) => {
          if (
            url.includes(
              '0x9d6f5e6009d65f65493244b82682b7210648d1dad10ecece2f81c01e951d4ed0'
            )
          ) {
            return { data: { error_message: 'execution error' } }
          } else if (
            url.includes(
              '0x9d6f5e6009d65f65493244b82682b7210648d1dad10ecece2f81c01e951d41d0'
            )
          ) {
            return { code: 404 }
          }
        },
      }),
    }
  })
})

describe('Tenderly', () => {
  describe('getTransactionDetails', () => {
    it('should return the result', async () => {
      const result = await getTransactionDetails({} as any)(
        '0x9d6f5e6009d65f65493244b82682b7210648d1dad10ecece2f81c01e951d4ed0',
        ChainId.POL
      )

      expect(result.error_message).toEqual('execution error')
    })

    const failedRequestCases = [
      {
        value: {
          hash: '0x9d6f5e6009d65f65493244b82682b7210648d1dad10ecece2f81c01e951d4ed0',
          chain: ChainId.AUR,
        },
        expected: 'The requested tx chain is not supported by Tenderly',
      },
      {
        value: {
          hash: '0x9d6f5e6009d65f65493244b82682b7210648d1dad10ecece2f81c01e951d41d0',
          chain: ChainId.POL,
        },
        expected: 'The tx was not found by Tenderly',
      },
    ]

    it.each(failedRequestCases)(
      'should return the $expected error',
      async ({ value, expected }) => {
        const result = await getTransactionDetails({} as any)(
          value.hash,
          value.chain
        ).catch((err) => err)

        expect(result.message).toEqual(expected)
      }
    )
  })
})
