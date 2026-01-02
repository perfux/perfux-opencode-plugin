# perfux-opencode-plugin

OpenCode plugin with Context7 MCP, research agent, and debug skill.

## Install

Add to `opencode.json`:
```json
{
  "plugin": ["perfux-opencode-plugin"]
}
```

For private repo access, manually install first:
```bash
cd ~/.opencode && bun add "git+ssh://git@github.com:perfux/perfux-opencode-plugin.git"
```

## Features

| Feature | Usage |
|---------|-------|
| Context7 MCP | Auto-injected, use `mcp__context7__*` tools |
| Research agent | `@research <query>` |
| Debug skill | `/debug` - adds removable debug logs |

## Debug Skill

The debug skill teaches how to add logs with `[DEBUG:PERFUX]` marker.

Remove all debug logs:
```bash
bun .opencode/skill/debug/scripts/remove-debug-logs.ts
bun .opencode/skill/debug/scripts/remove-debug-logs.ts --dry-run
```
