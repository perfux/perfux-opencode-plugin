---
name: debug
description: Add traceable debug logs that can be auto-removed with a single command. Use when debugging issues - logs follow a strict format for clean removal.
---

# Debug Logging

Add debug logs in this exact format so they can be auto-removed:

## Format

```
// [DEBUG:PERFUX] <description>
console.log("[DEBUG:PERFUX]", <values>);
```

## Examples

**JavaScript/TypeScript:**
```js
// [DEBUG:PERFUX] Check user state
console.log("[DEBUG:PERFUX]", { user, isLoggedIn });
```

**Python:**
```python
# [DEBUG:PERFUX] Check user state
print("[DEBUG:PERFUX]", user, is_logged_in)
```

## Process

1. Identify the issue area
2. Add debug logs at key points (entry, exit, state changes)
3. Run the code and analyze output
4. Iterate: add more logs if needed
5. When done, run the removal script

## Removal

Run from project root:

```bash
.opencode/skill/debug/scripts/remove-debug-logs.ts
```

Or with bun:

```bash
bun .opencode/skill/debug/scripts/remove-debug-logs.ts
```

All lines containing `[DEBUG:PERFUX]` are removed automatically.
