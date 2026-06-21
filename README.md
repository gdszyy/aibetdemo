# GOTO

## Rules
- General Rules: [general-rules.md](./.agent/rules/general-rules.md)
- Frontend Architecture: [frontend.md](.agent/rules/frontend.md)

## Workflows
- `/init` Initialize project context: [init.md](./.agent/workflows/init.md)
- `/a` Analyze implementation plan: [a.md](./.agent/workflows/a.md)
    -  `/a -m` Optionally output Plan md document to @.agent/plans/
        - e.g. Mobile Adaptation Plan [mobile-adaptation.md](./.agent/plans/mobile-adaptation.md)
- `/cr` Code Review: [cr.md](./.agent/workflows/cr.md)
- `/uc` Review project, update context: [uc.md](./.agent/workflows/uc.md)
- ~~`/rt` Deploy/Release: [rt.md](.agent/archive/rt.md)~~ 
  > This prompt includes automatic Merge + Release. Manually merging code to test / test1 / test2 branches triggers Github Actions for automatic deployment to the corresponding test environments. It is recommended to manually merge code to test / test1 / test2 branches and not use this prompt.
- ~~`/uds` Update Design System: [uds.md](.agent/archive/uds.md)~~

## Environments
- ~~test (currently corresponds to branch test): https://match-pc.helix.city~~
- test1 (currently corresponds to branch test1): https://xp-match-pc-test1.helix.city
- ~~test2 (currently corresponds to branch test2): https://xp-match-pc-test2.helix.city~~

## Railway deployment

This repository is ready to deploy as a Railway Node/Next.js service via `railway.toml`.

Railway should use:

```bash
pnpm build:railway
node .next/standalone/server.js
```

`build:railway` forces Next.js `standalone` output. The standalone server reads Railway's `PORT` automatically.

Required setup in Railway:

- Use the GitHub repo root as the service root.
- Add the production environment variables from `.env.production` to Railway Variables.
- Keep sensitive Sentry upload values as Railway Variables if source-map upload is enabled.

Notes:

- The legacy ECR-based production Dockerfile is kept as `Dockerfile.ecr`.
- Do not place a root-level `Dockerfile` unless Railway should build with Docker instead of Railpack.
