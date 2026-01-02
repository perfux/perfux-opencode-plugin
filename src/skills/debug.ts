export const debugSkill = {
  name: "debug",
  description: "Add traceable debug logs that can be auto-removed",
  template: `# Debug Logging Skill

## Log Format
Always use this exact format so logs can be auto-removed:

\`\`\`
// [DEBUG:PERFUX] <description>
console.log("[DEBUG:PERFUX]", <values>);
\`\`\`

### Examples

**JavaScript/TypeScript:**
\`\`\`js
// [DEBUG:PERFUX] Check user state
console.log("[DEBUG:PERFUX]", { user, isLoggedIn });
\`\`\`

**Python:**
\`\`\`python
# [DEBUG:PERFUX] Check user state
print("[DEBUG:PERFUX]", user, is_logged_in)
\`\`\`

## Process
1. Identify the issue area
2. Add debug logs at key points (entry, exit, state changes)
3. Run the code and analyze output
4. Iterate: add more logs if needed
5. When done: run \`npx perfux-opencode-plugin remove-debug-logs\` or \`remove-debug-logs\`

## Removal
All lines containing \`[DEBUG:PERFUX]\` get removed automatically.
Run from project root:
\`\`\`bash
npx perfux-opencode-plugin remove-debug-logs
\`\`\`

Or if installed globally:
\`\`\`bash
remove-debug-logs
\`\`\`
`,
}
