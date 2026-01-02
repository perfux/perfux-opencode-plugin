import type { Plugin } from "@opencode-ai/plugin"
import { researchAgent } from "./agents/research.js"
import { debugSkill } from "./skills/debug.js"
import { existsSync, appendFileSync, readFileSync } from "node:fs"
import { join } from "node:path"

const PerfuxPlugin: Plugin = async (ctx) => {
  // Ensure .context/ is gitignored in the project
  const ensureContextIgnored = () => {
    const gitignorePath = join(ctx.directory, ".gitignore")
    const ignoreEntry = "\n# Perfux plugin research folder\n.context/\n"

    if (existsSync(gitignorePath)) {
      const content = readFileSync(gitignorePath, "utf-8")
      if (!content.includes(".context/")) {
        appendFileSync(gitignorePath, ignoreEntry)
      }
    } else {
      appendFileSync(gitignorePath, ignoreEntry)
    }
  }

  // Run once on plugin load
  try {
    ensureContextIgnored()
  } catch {
    // Ignore errors (e.g., read-only filesystem)
  }

  return {
    config: async (config: Record<string, unknown>) => {
      // Inject Context7 MCP server
      config.mcp = {
        ...(config.mcp as Record<string, unknown>),
        context7: {
          command: "npx",
          args: ["-y", "@upstash/context7-mcp@latest"],
        },
      }

      // Inject research agent
      config.agent = {
        ...(config.agent as Record<string, unknown>),
        research: researchAgent,
      }

      // Inject debug skill
      config.skill = {
        ...(config.skill as Record<string, unknown>),
        debug: debugSkill,
      }
    },

    // Inject emoji instruction into system prompt
    "experimental.chat.system.transform": async (_input, output) => {
      output.system.push(`<perfux-plugin-instruction>
Start every reply with a relevant emoji.
</perfux-plugin-instruction>`)
    },
  }
}

export default PerfuxPlugin
