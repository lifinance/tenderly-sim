import { ChainId } from '@lifi/types'

export const TENDERLY_BASE_URL = 'https://api.tenderly.co/api/v1/'
export const TENDERLY_REQUEST_HEADERS = (accessKey: string) => ({
  'X-Access-Key': accessKey
})

export type TenderlyConfig = {
  accessKey: string,
  user: string,
  project: string,
}

export const projectBaseUrl = (tenderlyConfig: TenderlyConfig) =>
   `${TENDERLY_BASE_URL}account/${tenderlyConfig.user}/project/${tenderlyConfig.project}`

export const TENDERLY_CHAINS: number[] = [
  ChainId.ETH,
  ChainId.RSK,
  ChainId.BSC,
  ChainId.DAI,
  ChainId.POL,
  ChainId.OPT,
  ChainId.ARN,
  ChainId.ARB,
  ChainId.AVA,
  ChainId.FTM,
  ChainId.BAS,
  ChainId.LNA,
  ChainId.MOR,
  ChainId.MOO,
  ChainId.MOD,
  ChainId.MNT,
  ChainId.BLS,
  ChainId.TAI,
  ChainId.FRA,
]

export const knownProxyTokens: Record<
  number,
  Record<Lowercase<string>, Lowercase<string>>
> = {
  [ChainId.ETH]: {
    // AAVE
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9':
      '0x5d4aa78b08bc7c530e21bf7447988b1be7991322',
    // GUSD
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd':
      // '0x6704ba24b8640bccee6bf2fd276a6a1b8edf4ade', // ERC20Impl
      '0xc42b14e49744538e3c239f8ae48a1eaaf35e68a0', // ERC20Store
    '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42':
      '0xcbe10aa4baab18e75f6d9778aca6c1afb889a7cf',
  },
  [ChainId.ARB]: {
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8':
      '0x1efb3f88bc88f03fd1804a5c53b7141bbef5ded8',
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9':
      '0xf31e1ae27e7cd057c1d6795a5a083e0453d39b50',
    // WBTC
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    // rETH
    '0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    // LUSD
    '0x93b346b6bc2548da6a1e7d98e9a421b42541425b':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    // WOO
    '0xcafcd85d8ca7ad1e1c6f82f651fa15e33aefd07b':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    '0x079504b86d38119f859c4194765029f692b7b7aa':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    '0x07e49d5de43dda6162fa28d24d5935c151875283':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    '0x0c880f6761f1af8d9aa9c466984b80dab9a8c9e8':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    '0x21e60ee73f17ac0a411ae5d690f908c3ed66fe12':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42':
      '0x80a267c8e73cccdf84fb622bbe640d21eea87001',
    '0x56659245931cb6920e39c189d2a0e7dd0da2d57b':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    '0x641441c631e2f909700d2f41fd87f0aa6a6b4edb':
      '0xe386affd4830423ead9b3047618e2f4f9057a299',
    '0xae6aab43c4f3e0cea4ab83752c278f8debaba689':
      '0x3f770ac673856f105b586bb393d122721265ad46',
    '0xe85b662fe97e8562f4099d8a1d5a92d4b453bf30':
      '0x3f770ac673856f105b586bb393d122721265ad46',
  },
  [ChainId.POL]: {
    // UMA
    '0x3066818837c5e6ed6601bd5a91b0762877a6b731':
      '0xf435c709151419833db63a04dadfcb4be96ecda5',
    // WOO
    '0x1b815d120b3ef02039ee11dc2d33de7aa4a8c603':
      '0x82abcc85578de42058c0dfd90d9bd17d8ce76239',
    // unable to parse proxy target in tenderly
    // '0xc2132d05d31c914a87c6611c10748aeb04b58e8f':
    //   '0x7ffb3d637014488b63fb9858e279385685afc1e2',
    '0x08c15fa26e519a78a666d19ce5c646d55047e0a3':
      '0xa1b98220a512d1828ee8299f6bab20b926cbbd63',
    '0x14af1f2f02dccb1e43402339099a05a5e363b83c':
      '0x295d9b0efc4d4bfdd269a22f88e400973928cc8e',
    '0x25788a1a171ec66da6502f9975a15b609ff54cf6':
      '0x2423b40c3abe64cd7b13312f2fd8e711724d1ea4',
    '0x2ab4f9ac80f33071211729e45cfc346c1f8446d5':
      '0x7d44d22efe405b89bf62ba25d8ede4960adb6674',
    '0x43df9c0a1156c96cea98737b511ac89d0e2a1f46':
      '0xb3cc26cd221aa74dad9d30f0b0236ada8c01e767',
    '0x692c44990e4f408ba0917f5c78a83160c1557237':
      '0x4a03fd0c903f77969bf4f87c7ac6acd7872e28ea',
    '0x8c92e38eca8210f4fcbf17f0951b198dd7668292':
      '0x599ba8e27ef0a40b2f1bd56dcd61267aa075f2d8',
    '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3':
      '0xf957db7230b879cc905a7afa87748d8b7da7689e',
    '0xecc4176b90613ed78185f01bd1e42c5640c4f09d':
      '0xa00918df5236e5bab5b62c8afb4857a95dfd7260',
    '0xf972daced7c6b03223710c11413036d17eb298f6':
      '0x66ef3e890233c63ce6bd4362ef3a089abb804ed6',
  },
  [ChainId.LNA]: {
    '0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5':
      '0xc0583e2f5930ede5fab9d57bac4169878730b010',
    '0x3aab2285ddcddad8edf438c1bab47e1a9d05a9b4':
      '0xc0583e2f5930ede5fab9d57bac4169878730b010',
    '0xa219439258ca9da29e9cc4ce5596924745e12b93':
      '0xc0583e2f5930ede5fab9d57bac4169878730b010',
    '0x176211869ca2b568f2a7d4ee941e073a821ee1ff':
      '0xab838fe7d492c621a5b1b23952af99cc37a2e0d3',
  },
}

export const knownFailingTokens: Record<number, Lowercase<string>[]> = {
  [ChainId.ETH]: [
    '0x57ab1ec28d129707052df4df418d58a2d46d5f51', // sUSD proxy does not work
    '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', // SNX proxy does not work
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // AAVE, balance mapping is more complex (address => tuple)
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd', // GUSD, state is stored in other contract
    '0xd31a59c85ae9d8edefec411d448f90841571b89c', // SOL tokenImplementation: '0x0fd04a68d3c3a692d6fa30384d1a87ef93554ee6' // (nested state.allowances mapping)
  ],
  [ChainId.POL]: [
    '0xd93f7e271cb87c23aaa73edc008a79646d1f9912', // same as on SOL on ETH
    '0x576cf361711cd940cd9c397bb98c4c896cbd38de', // same as on SOL on ETH
  ],
  [ChainId.AVA]: [
    '0xfe6b19286885a4f7f55adad09c3cd1f906d2478f', // same as on SOL on ETH
  ],
  [ChainId.OPT]: [
    '0x4200000000000000000000000000000000000006', // WETH
    '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', // sUSD proxy does not work
  ],
  [ChainId.DAI]: [
    '0x7122d7661c4564b7c6cd4878b06766489a6028a2', // MATIC
  ],
  [ChainId.BSC]: [
    '0xb04906e95ab5d797ada81508115611fee694c2b3', // USDC Wormhole, proxy does not work
  ],
  [ChainId.MNT]: [
    '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9', // Tenderly can't find proxy implementation
  ],
}

const allowanceNames = [
  'allowed',
  '_allowed',
  'allowance',
  '_allowance',
  'allowances',
  '_allowances',
  'approvals',
  '_approvals',
]
export const knownAllowanceMappings: Record<
  string,
  { names: string[]; mask: string }
> = {
  'mapping (address => mapping (address => uint256))': {
    names: allowanceNames,
    mask: '[OWNER_ADDRESS][SPENDER_ADDRESS]',
  },
  'mapping (address => mapping (address => uint96))': {
    names: allowanceNames,
    mask: '[OWNER_ADDRESS][SPENDER_ADDRESS]',
  },
}

const balanceNames = [
  'balance',
  '_balance',
  'balances',
  '_balances',
  'balanceOf',
  '_balanceOf',
  'balanceAndBlacklistStates',
]
export const knownBalanceMappings: Record<
  string,
  { names: string[]; mask: string }
> = {
  'mapping (address => uint256)': {
    names: balanceNames,
    mask: '[OWNER_ADDRESS]',
  },
  'mapping (address => uint96)': {
    names: balanceNames,
    mask: '[OWNER_ADDRESS]',
  },
}
