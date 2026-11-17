# tenderly-sim

`@lifi/tenderlysim`, a public npm library that simulates LI.FI quotes and transactions through the Tenderly
API. It fetches transaction details, runs simulations and builds state overrides (fake token balances and
approvals, native balance) so a quote can be simulated for any sender.

## Layout

- `src/index.ts`: public entry point, re-exports `src/tenderly`.
- `src/tenderly/`: the library. `tenderly.simulate.ts` (`simulate`, `getStateOverwrites`),
  `tenderly.api.ts` (`getTransactionDetails`), `tenderly.overwrites.ts` (storage-slot overrides),
  `tenderly.config.ts` (`TenderlyConfig`, API base URL, supported chain list), `tenderly.types*.ts`.
- `src/http/`, `src/logger/`, `src/common/`: axios wrapper, pino logger, `LifiError`.
- `src/demo.ts`: manual example run (`pnpm demo`). Not exported from `src/index.ts`, but it is compiled into
  `build/` and so ships in the npm tarball.
- `build/`: compiled output (git-ignored), the only folder published to npm.

Inside `src/`, import sibling modules as `@tenderlysim/<folder>` (path alias in `tsconfig.base.json`,
mapped for Jest in `jest.config.ts`); `pnpm build` rewrites the alias with `resolve-tspaths`.

## Commands

pnpm (version pinned in `packageManager`), Node 20 or newer (`.nvmrc`).

```bash
pnpm install
pnpm build                 # tsc with tsconfig.build.json, then resolve-tspaths
pnpm test                  # all Jest tests
pnpm test:unit             # *.unit.spec.ts (none exist yet; passes with no tests)
pnpm test:int              # *.int.spec.ts (HTTP is mocked)
pnpm lint                  # ESLint with Prettier rules; pnpm lint:fix to fix
pnpm check:types           # tsc --noEmit
pnpm check:circular-deps   # madge
```

CI (`.github/workflows/test.yml`, `lint.yml`) runs `test:unit`, `test:int`, `check:types`,
`check:circular-deps` and `lint`. `semantic-pr.yml` checks the PR title.

## Env

None. The library reads no environment variables: callers pass a `TenderlyConfig` (`accessKey`, `user`,
`project`) to `simulate` and `getTransactionDetails`. Never commit a real access key, including in
`src/demo.ts`.

## Conventions

- Conventional commits, enforced by commitlint in the husky `commit-msg` hook. The `pre-commit` hook runs
  `pnpm test`.
- Prettier style (`.prettierrc.js`): no semicolons, single quotes, ES5 trailing commas, 80 columns.
- Releases: `pnpm release` runs standard-version, which bumps `package.json`, updates `CHANGELOG.md` and
  creates the tag; `pnpm release:beta` does the same without touching `CHANGELOG.md`. Pushing a `vX.Y.Z` tag (or `-alpha.N` / `-beta.N`) runs
  `.github/workflows/publish.yaml`, which creates the GitHub release and publishes to npm.
- Supported chains live in `TENDERLY_CHAINS` in `tenderly.config.ts`, in the order of the Tenderly docs.

## Ownership

API Expansion squad, reviewer Daniela (`@melianessa`).
Review requests: request the reviewer above on the PR.
