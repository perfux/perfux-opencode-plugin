# Test Plan

## Setup
```bash
cd ~/.opencode && bun add "git+ssh://git@github.com:perfux/perfux-opencode-plugin.git"
```

Add to project's `opencode.json`:
```json
{ "plugin": ["perfux-opencode-plugin"] }
```

## Tests

### 1. Emoji Injection
- [ ] Start opencode, send any message
- [ ] Expected: Reply starts with emoji

### 2. Context7 MCP
- [ ] Run: `What tools do you have?`
- [ ] Expected: Lists `mcp__context7__*` tools

### 3. Research Agent
- [ ] Run: `@research how does zustand work`
- [ ] Expected: Uses Context7/web search, concise response

### 4. Debug Skill
- [ ] Run: `/debug`
- [ ] Expected: Shows debug logging instructions
- [ ] Check: `.opencode/skill/debug/` folder exists with SKILL.md and scripts/

### 5. Debug Log Removal
- [ ] Add `[DEBUG:PERFUX]` logs to a test file
- [ ] Run: `bun .opencode/skill/debug/scripts/remove-debug-logs.ts --dry-run`
- [ ] Expected: Shows files that would be cleaned
- [ ] Run without `--dry-run`
- [ ] Expected: Debug lines removed

### 6. .context/ Gitignore
- [ ] Check `.gitignore` contains `.context/`
