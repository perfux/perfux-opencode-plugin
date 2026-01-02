# Test Plan

## Setup
```bash
cd /path/to/perfux-opencode-plugin
npm install && npm run build
npm link

cd ~/.config/opencode  # or your test project
npm link perfux-opencode-plugin
```

Add to `opencode.json`:
```json
{ "plugin": ["perfux-opencode-plugin"] }
```

## Tests

### 1. Emoji Injection
- [ ] Start opencode, send any message
- [ ] **Expected**: Reply starts with emoji

### 2. Context7 MCP
- [ ] Run: `What tools do you have?`
- [ ] **Expected**: Lists `mcp__context7__*` tools

### 3. Research Agent
- [ ] Run: `@research how does zustand work`
- [ ] **Expected**: Uses Context7/web search, concise response

### 4. Repo Cloning + Gitignore
- [ ] Ask research agent to clone a repo
- [ ] **Expected**: Clones to `.context/`, entry added to `.gitignore`

### 5. Debug Skill
- [ ] Run: `/debug`
- [ ] Add some `[DEBUG:PERFUX]` logs to a test file
- [ ] Run: `npx perfux-opencode-plugin remove-debug-logs --dry-run`
- [ ] **Expected**: Shows files/lines that would be removed
- [ ] Run without `--dry-run`
- [ ] **Expected**: Debug lines removed from files
