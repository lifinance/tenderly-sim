import type { Config } from 'jest'

import jestConfig from './jest.config'

const config: Config = {
  ...jestConfig,
  testMatch: ['**/*.int.spec.ts'],
}

export default config
