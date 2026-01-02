#!/usr/bin/env bun
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
const DEBUG_MARKER = "[DEBUG:PERFUX]";
const EXTENSIONS = [".js", ".ts", ".jsx", ".tsx", ".py", ".rb", ".go", ".rs", ".java", ".kt", ".swift", ".c", ".cpp", ".h"];
const SKIP_DIRS = ["node_modules", ".git", "dist", "build", ".context", "__pycache__", ".venv", "venv", ".opencode"];
function removeDebugLogs(dir, dryRun = false) {
    let removed = 0;
    function processFile(filePath) {
        const content = readFileSync(filePath, "utf-8");
        const lines = content.split("\n");
        const filtered = lines.filter((line) => !line.includes(DEBUG_MARKER));
        if (filtered.length !== lines.length) {
            const count = lines.length - filtered.length;
            removed += count;
            console.log(`${dryRun ? "[DRY RUN] " : ""}${filePath}: removing ${count} debug line(s)`);
            if (!dryRun) {
                writeFileSync(filePath, filtered.join("\n"));
            }
        }
    }
    function walk(currentDir) {
        const entries = readdirSync(currentDir);
        for (const entry of entries) {
            if (SKIP_DIRS.includes(entry))
                continue;
            const fullPath = join(currentDir, entry);
            const stat = statSync(fullPath);
            if (stat.isDirectory()) {
                walk(fullPath);
            }
            else if (stat.isFile() && EXTENSIONS.includes(extname(entry))) {
                processFile(fullPath);
            }
        }
    }
    walk(dir);
    return removed;
}
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("-n");
const dir = args.find((a) => !a.startsWith("-")) || process.cwd();
console.log(`Scanning for ${DEBUG_MARKER} in ${dir}${dryRun ? " (dry run)" : ""}...\n`);
const count = removeDebugLogs(dir, dryRun);
if (count === 0) {
    console.log("\nNo debug logs found.");
}
else {
    console.log(`\n${dryRun ? "Would remove" : "Removed"} ${count} debug line(s) total.`);
}
