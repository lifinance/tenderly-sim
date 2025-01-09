import type { Config } from 'jest'
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.base.json'

const config: Config = {
  preset: 'ts-jest',
  testTimeout: 60000,
  testEnvironment: 'node',
  roots: ['./src'],
  verbose: false,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  collectCoverage: false,
  coverageThreshold: {
    global: {
      branches: 19,
      functions: 26,
      lines: 43,
      statements: 43,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src',
  }),
}

export default config
