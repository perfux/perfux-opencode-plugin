# Plugin Implementation Handoff

## Goal

Create an npm-published OpenCode plugin that bundles:

- 2 MCP servers
- 1 subagent
- 2 skills
- Instructions on how to use everything together

## Reference: oh-my-opencode

All patterns below come from analyzing `code-yeongyu/oh-my-opencode` (4.8k stars, battle-tested)

## Project Structure

```
my-opencode-plugin/
├── src/
│   ├── index.ts              # Main plugin export
│   ├── agents/
│   │   └── my-subagent.ts
│   ├── mcp/
│   │   ├── server1.ts
│   │   └── server2.ts
│   ├── skills/
│   │   └── index.ts
│   ├── injection/
│   │   └── usage-instructions.ts
│   └── types.ts
├── package.json
├── tsconfig.json
├── AGENTS.md              # Auto-injected instructions
└── README.md
```

## Key Implementation Patterns

### 1. MCP Server Injection (via `config` hook)

In `src/index.ts`, the `config` hook receives the full config object and can modify `config.mcp`:

```typescript
import type { Plugin } from '@opencode-ai/plugin'

const MyPlugin: Plugin = async ctx => {
  return {
    config: async config => {
      // Inject your MCPs here
      config.mcp = config.mcp || {}
      config.mcp['my-mcp-1'] = {
        type: 'remote',
        url: 'https://my-mcp-server.com/mcp',
        headers: { Authorization: 'Bearer {env:MY_API_KEY}' },
      }
      config.mcp['my-mcp-2'] = {
        type: 'local',
        command: ['npx', '-y', '@my-org/my-mcp-server'],
        environment: { MY_ENV_VAR: 'value' },
      }
    },
  }
}
```

### 2. Subagent Injection (via `config.agent`)

Same config hook can inject agents:

```typescript
config: async config => {
  config.agent = config.agent || {}
  config.agent['my-specialist'] = {
    mode: 'subagent',
    model: 'anthropic/claude-sonnet-4-20250514',
    description: 'Specializes in X task',
    prompt: 'Your system prompt here...',
    tools: { write: true, edit: true, bash: 'ask' },
  }
}
```

### 3. Built-in Skills

Skills are returned from main export, not config hook. They can include their own MCPs:

```typescript
// src/skills/index.ts
import type { BuiltinSkill } from './types'

const skill1: BuiltinSkill = {
  name: 'my-skill-1',
  description: 'Does X',
  template: '# My Skill\n\nInstructions...',
  mcpConfig: {
    'skill-mcp': {
      command: 'npx',
      args: ['-y', '@my-org/skill-mcp'],
    },
  },
}

const skill2: BuiltinSkill = {
  name: 'my-skill-2',
  description: 'Does Y',
  template: '# Another Skill\n\n...',
}

export function createSkills(): BuiltinSkill[] {
  return [skill1, skill2]
}
```

Then in `src/index.ts`:

```typescript
import { createSkills } from './skills'

const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      skill: createSkillTool({ skills: createSkills() }),
      skill_mcp: createSkillMcpTool({ ... })  // For skill MCPs
    }
  }
}
```

### 4. AGENTS.md Auto-Injection

The `tool.execute.after` hook can append instructions after file reads:

```typescript
// src/injection/usage-instructions.ts

import type { PluginInput } from '@opencode-ai/plugin'
import { readFileSync } from 'node:fs'

export function createUsageInjector(ctx: PluginInput) {
  return {
    'tool.execute.after': async (input, output) => {
      if (input.tool === 'read') {
        const filePath = (output.metadata as { filePath?: string }).filePath
        if (filePath?.includes('AGENTS.md')) return // Avoid infinite loop

        // Find and inject plugin AGENTS.md
        const pluginAgentsMd = ctx.directory + '/AGENTS.md'
        if (existsSync(pluginAgentsMd)) {
          const content = readFileSync(pluginAgentsMd, 'utf-8')
          output.output += `\n\n## My Plugin Instructions\n${content}`
        }
      }
    },
  }
}
```

Usage instruction format:

```markdown
# MY PLUGIN USAGE

## When to use

- Use @my-specialist for X tasks
- Use skill:my-skill-1 for Y operations

## MCPs Available

- my-mcp-1: Use for Z functionality
- my-mcp-2: Use for W functionality

## Workflow

1. Start with X
2. Delegate to @my-specialist for analysis
3. Use skill:my-skill-1 to implement
```

## package.json Template

```json
{
  "name": "my-opencode-plugin",
  "version": "1.0.0",
  "description": "OpenCode plugin with MCPs, subagent, and skills",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "type": "module",
  "files": ["dist", "AGENTS.md"],
  "scripts": {
    "build": "bun build src/index.ts --outdir dist --target bun --format esm && tsc --emitDeclarationOnly",
    "prepublishOnly": "bun run build",
    "typecheck": "tsc --noEmit"
  },
  "keywords": ["opencode", "plugin", "mcp", "agent"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/my-opencode-plugin.git"
  },
  "dependencies": {
    "@opencode-ai/plugin": "^1.0.0",
    "@opencode-ai/sdk": "^1.0.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "bun-types": "latest"
  }
}
```

## Building

```bash
# Install dependencies
bun install

# Build
bun run build

# Output: dist/ directory
```

## Publishing to npm

```bash
# Login to npm
npm login

# Publish
npm publish

# Or skip dry run for first publish
npm publish --dry-run
```

## User Installation

After publishing, users add to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["my-opencode-plugin"]
}
```

OpenCode auto-installs from npm at startup using Bun.

## Where to Find More Details

**Oh-my-opencode source (the reference):**

- https://github.com/code-yeongyu/oh-my-opencode
- Key files to study:
  - `src/index.ts` - Main plugin entry
  - `src/plugin-handlers/config-handler.ts` - Config injection pattern
  - `src/agents/oracle.ts` - Subagent pattern
  - `src/features/builtin-skills/skills.ts` - Skills pattern
  - `src/mcp/index.ts` - MCP pattern
  - `package.json` - Build/publishing

**OpenCode Plugin SDK types:**

- `@opencode-ai/plugin` - Plugin interface and hooks
- `@opencode-ai/sdk` - SDK client and types
- Docs: https://opencode.ai/docs/plugins

**OpenCode Config docs:**

- Config structure: https://opencode.ai/docs/config
- MCP config: https://opencode.ai/docs/mcp-servers
- Agents config: https://opencode.ai/docs/agents

**MCP SDK:**

- `@modelcontextprotocol/sdk` - For building MCP servers
- Docs: https://modelcontextprotocol.io

## Quick Checklist

- [ ] Create project structure
- [ ] Implement MCP server configs
- [ ] Implement subagent
- [ ] Implement skills (with optional MCPs)
- [ ] Add AGENTS.md usage instructions
- [ ] Create config hook to inject everything
- [ ] Setup package.json
- [ ] Setup tsconfig.json
- [ ] Test locally in `.opencode/plugin/`
- [ ] Publish to npm
- [ ] Document installation in README.md

## Implementation Notes

1. **Config hook runs once at startup** - perfect for registering agents/MCPs
2. **Tool hooks run on every operation** - use sparingly for performance
3. **Skills are auto-discoverable** via the `skill` tool
4. **Skill MCPs need `skill_mcp` tool** to access their operations
5. **AGENTS.md injection works via `tool.execute.after`** after file reads
