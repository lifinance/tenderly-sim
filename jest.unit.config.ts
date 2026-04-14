import type { Config } from 'jest'

import jestConfig from './jest.config'

const config: Config = {
  ...jestConfig,
  testMatch: ['**/*.unit.spec.ts'],
}

export default config
