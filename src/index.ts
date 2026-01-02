import type { Plugin } from "@opencode-ai/plugin"
import { researchAgent } from "./agents/research.js"
import { existsSync, mkdirSync, cpSync, appendFileSync, readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const PerfuxPlugin: Plugin = async (ctx) => {
  // Ensure .context/ is gitignored
  const ensureContextIgnored = () => {
    const gitignorePath = join(ctx.directory, ".gitignore")
    const entry = "\n# Perfux plugin\n.context/\n"

    if (existsSync(gitignorePath)) {
      const content = readFileSync(gitignorePath, "utf-8")
      if (!content.includes(".context/")) {
        appendFileSync(gitignorePath, entry)
      }
    }
  }

  // Install bundled skill to project
  const installSkill = () => {
    const src = join(__dirname, "skill", "debug")
    const dest = join(ctx.directory, ".opencode", "skill", "debug")

    if (existsSync(src)) {
      mkdirSync(dirname(dest), { recursive: true })
      cpSync(src, dest, { recursive: true, force: true })
    }
  }

  try {
    ensureContextIgnored()
    installSkill()
  } catch {
    // Ignore errors
  }

  return {
    config: async (config: Record<string, unknown>) => {
      // Inject Context7 MCP server
      config.mcp = {
        ...(config.mcp as Record<string, unknown>),
        context7: {
          type: "local",
          command: ["npx", "-y", "@upstash/context7-mcp@latest"],
        },
      }

      // Inject research agent
      config.agent = {
        ...(config.agent as Record<string, unknown>),
        research: researchAgent,
      }
    },

    "experimental.chat.system.transform": async (_input, output) => {
      output.system.push(`<perfux-plugin-instruction>
Start every reply with a relevant emoji.
</perfux-plugin-instruction>`)
    },
  }
}

export default PerfuxPlugin
