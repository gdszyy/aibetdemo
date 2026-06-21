import fs from 'node:fs';
import path from 'node:path';

/**
 * Sync AI Agent Configurations
 *
 * Single source of truth: .agent/
 *
 * Targets:
 *   1. Workflows:  .agent/workflows/*.md  → .gemini/commands/*.toml
 *   2. Rules:      .agent/rules/*.md      → .claude/rules/*.md (symlinks)
 *   3. Rules:      .agent/rules/*.md      → .cursor/rules/*.mdc (generated MDC)
 *   4. Copilot:    AGENTS.md              → .github/copilot-instructions.md (symlink)
 *   5. Gemini:     context.fileName       → .gemini/settings.json (merge)
 *
 * Usage: pnpm sync:agents
 */

const ROOT = process.cwd();
const WORKFLOW_SRC = path.join(ROOT, '.agent/workflows');
const RULES_SRC = path.join(ROOT, '.agent/rules');

// Targets
const GEMINI_COMMANDS_DEST = path.join(ROOT, '.gemini/commands');
const CLAUDE_RULES_DEST = path.join(ROOT, '.claude/rules');
const CURSOR_RULES_DEST = path.join(ROOT, '.cursor/rules');
const COPILOT_INSTRUCTIONS = path.join(ROOT, '.github/copilot-instructions.md');
const GEMINI_SETTINGS = path.join(ROOT, '.gemini/settings.json');

/** MDC frontmatter config per rule file */
const CURSOR_RULE_CONFIG: Record<string, { description: string; alwaysApply: boolean; globs?: string }> = {
    'general-rules.md': {
        description: 'Project code of conduct, tech stack, directory structure, coding standards',
        alwaysApply: true,
    },
    'frontend.md': {
        description: 'Frontend architecture, design tokens, state management, key mechanisms',
        alwaysApply: false,
        globs: 'src/**/*.{ts,tsx,css}',
    },
};

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function parseFrontmatter(content: string) {
    const lines = content.split('\n');
    const frontmatter: Record<string, string> = {};
    let body = content;

    if (lines[0] === '---') {
        const endIdx = lines.indexOf('---', 1);
        if (endIdx !== -1) {
            const fmLines = lines.slice(1, endIdx);
            for (const line of fmLines) {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    frontmatter[key.trim()] = valueParts.join(':').trim();
                }
            }
            body = lines
                .slice(endIdx + 1)
                .join('\n')
                .trim();
        }
    }

    return { frontmatter, body };
}

function cleanupStaleFiles(dir: string, activeNames: Set<string>, ext: string) {
    const existing = fs.readdirSync(dir).filter((f) => f.endsWith(ext));
    for (const file of existing) {
        if (!activeNames.has(file)) {
            fs.unlinkSync(path.join(dir, file));
            console.log(`  🗑️  Removed stale: ${file}`);
        }
    }
}

// ─── 1. Workflows → Gemini Commands ────────────────────────────────────────

function syncGeminiCommands() {
    console.log('📋 Syncing workflows → .gemini/commands/*.toml');
    ensureDir(GEMINI_COMMANDS_DEST);

    if (!fs.existsSync(WORKFLOW_SRC)) {
        console.log('  ⏭️  No workflows directory, skipping.');
        return;
    }

    const files = fs.readdirSync(WORKFLOW_SRC).filter((f) => f.endsWith('.md'));
    const activeNames = new Set<string>();

    for (const file of files) {
        const content = fs.readFileSync(path.join(WORKFLOW_SRC, file), 'utf-8');
        const { frontmatter, body } = parseFrontmatter(content);

        const cmdName = file.replace('.md', '');
        const destFile = `${cmdName}.toml`;
        activeNames.add(destFile);

        const description = (frontmatter.description || `Workflow: ${cmdName}`).replace(/"/g, '\\"');
        const escapedBody = body.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');
        const tomlContent = `description = "${description}"\nprompt = """\n${escapedBody}\n"""\n`;

        fs.writeFileSync(path.join(GEMINI_COMMANDS_DEST, destFile), tomlContent);
        console.log(`  ✅ /${cmdName}`);
    }

    cleanupStaleFiles(GEMINI_COMMANDS_DEST, activeNames, '.toml');
}

// ─── 2. Rules → Claude Rules (symlinks) ────────────────────────────────────

function syncClaudeRules() {
    console.log('📋 Syncing rules → .claude/rules/*.md (symlinks)');
    ensureDir(CLAUDE_RULES_DEST);

    if (!fs.existsSync(RULES_SRC)) {
        console.log('  ⏭️  No rules directory, skipping.');
        return;
    }

    const files = fs.readdirSync(RULES_SRC).filter((f) => f.endsWith('.md'));
    const activeNames = new Set<string>();

    for (const file of files) {
        const destPath = path.join(CLAUDE_RULES_DEST, file);
        const relativeSrc = path.relative(CLAUDE_RULES_DEST, path.join(RULES_SRC, file));
        activeNames.add(file);

        try {
            fs.lstatSync(destPath);
            fs.unlinkSync(destPath);
        } catch {
            // File doesn't exist
        }
        fs.symlinkSync(relativeSrc, destPath);
        console.log(`  ✅ ${file} → ${relativeSrc}`);
    }

    cleanupStaleFiles(CLAUDE_RULES_DEST, activeNames, '.md');
}

// ─── 3. Rules → Cursor Rules (generated MDC) ──────────────────────────────

function syncCursorRules() {
    console.log('📋 Syncing rules → .cursor/rules/*.mdc (generated)');
    ensureDir(CURSOR_RULES_DEST);

    if (!fs.existsSync(RULES_SRC)) {
        console.log('  ⏭️  No rules directory, skipping.');
        return;
    }

    const files = fs.readdirSync(RULES_SRC).filter((f) => f.endsWith('.md'));
    const activeNames = new Set<string>();

    for (const file of files) {
        const content = fs.readFileSync(path.join(RULES_SRC, file), 'utf-8');
        const { body } = parseFrontmatter(content);

        const config = CURSOR_RULE_CONFIG[file] ?? {
            description: `Rule: ${file.replace('.md', '')}`,
            alwaysApply: true,
        };

        const mdcName = file.replace('.md', '.mdc');
        activeNames.add(mdcName);

        let frontmatter = `---\ndescription: "${config.description}"\nalwaysApply: ${config.alwaysApply}\n`;
        if (config.globs) {
            frontmatter += `globs: "${config.globs}"\n`;
        }
        frontmatter += '---\n\n';

        fs.writeFileSync(path.join(CURSOR_RULES_DEST, mdcName), frontmatter + body);
        console.log(`  ✅ ${mdcName}${config.globs ? ` (globs: ${config.globs})` : ' (always)'}`);
    }

    cleanupStaleFiles(CURSOR_RULES_DEST, activeNames, '.mdc');
}

// ─── 4. AGENTS.md → Copilot Instructions (symlink) ────────────────────────

function syncCopilotInstructions() {
    console.log('📋 Syncing AGENTS.md → .github/copilot-instructions.md (symlink)');

    const agentsMd = path.join(ROOT, 'AGENTS.md');
    if (!fs.existsSync(agentsMd)) {
        console.log('  ⏭️  No AGENTS.md found, skipping.');
        return;
    }

    ensureDir(path.dirname(COPILOT_INSTRUCTIONS));

    const relativeSrc = path.relative(path.dirname(COPILOT_INSTRUCTIONS), agentsMd);

    try {
        const existing = fs.lstatSync(COPILOT_INSTRUCTIONS);
        if (existing.isSymbolicLink()) {
            const currentTarget = fs.readlinkSync(COPILOT_INSTRUCTIONS);
            if (currentTarget === relativeSrc) {
                console.log(`  ✅ Already linked → ${relativeSrc}`);
                return;
            }
        }
        fs.unlinkSync(COPILOT_INSTRUCTIONS);
    } catch {
        // File doesn't exist
    }

    fs.symlinkSync(relativeSrc, COPILOT_INSTRUCTIONS);
    console.log(`  ✅ copilot-instructions.md → ${relativeSrc}`);
}

// ─── 5. Gemini Settings — context.fileName ─────────────────────────────────

function syncGeminiSettings() {
    console.log('📋 Syncing Gemini settings — context.fileName');

    let settings: Record<string, unknown> = {};
    if (fs.existsSync(GEMINI_SETTINGS)) {
        settings = JSON.parse(fs.readFileSync(GEMINI_SETTINGS, 'utf-8'));
    }

    const context = (settings.context as Record<string, unknown>) ?? {};
    const currentFileNames = context.fileName as string[] | undefined;
    const desiredFileNames = ['AGENTS.md'];

    if (JSON.stringify(currentFileNames) === JSON.stringify(desiredFileNames)) {
        console.log('  ✅ Already configured');
        return;
    }

    context.fileName = desiredFileNames;
    settings.context = context;

    ensureDir(path.dirname(GEMINI_SETTINGS));
    fs.writeFileSync(GEMINI_SETTINGS, `${JSON.stringify(settings, null, 4)}\n`);
    console.log(`  ✅ Set context.fileName = ${JSON.stringify(desiredFileNames)}`);
}

// ─── Main ──────────────────────────────────────────────────────────────────

console.log('🔄 Syncing AI agent configurations...\n');

syncGeminiCommands();
console.log();
syncClaudeRules();
console.log();
syncCursorRules();
console.log();
syncCopilotInstructions();
console.log();
syncGeminiSettings();

console.log('\n✨ All agent configs synced successfully.');
