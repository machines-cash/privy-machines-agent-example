# privy-machines-agent-example

Minimal `plain-node` starter for Machines agent cards.

## What this gives you

- Prewired Machines MCP endpoint config: `config/mcp.json`
- Simple plain-node agent action: `src/run-agent.mjs`
- Working disposable-card flow script: `src/create-disposable-card-and-pay.mjs`
- Policy template: `machines.policy.json`

This starter is pre-labeled for Privy auth. Fill Privy env vars when you add embedded auth.

## Use

```bash
cp .env.example .env
# add MACHINES_USER_API_KEY
npm run flow
npm run agent
```

## Keep it simple

- Start with `flow`.
- Keep agent scripts short.
- Keep policy narrow in `machines.policy.json`.

## Live Preview

- Preview: https://skill-deploy-ygi9miys28-codex-agent-deploys.vercel.app

