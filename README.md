# perfux-opencode-plugin

OpenCode plugin with Context7 MCP, research agent, and debug skill.

## Install

```bash
# From GitHub
npm install github:YOUR_USERNAME/perfux-opencode-plugin

# Or local
npm install /path/to/perfux-opencode-plugin
```

Add to `~/.config/opencode/opencode.json`:
```json
{
  "plugin": ["perfux-opencode-plugin"]
}
```

## Features

| Feature | Usage |
|---------|-------|
| Context7 MCP | Auto-injected, use `mcp__context7__*` tools |
| Research agent | `@research <query>` |
| Debug skill | `/debug` then add logs with `[DEBUG:PERFUX]` |

## Remove Debug Logs

```bash
npx perfux-opencode-plugin remove-debug-logs
npx perfux-opencode-plugin remove-debug-logs --dry-run  # preview
```

## .context/ Folder

Research agent can clone repos to `.context/`. Auto-added to `.gitignore`.
