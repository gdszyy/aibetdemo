import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const standaloneDir = join('.next', 'standalone');

function copyDir(source, target) {
    if (!existsSync(source)) {
        console.warn(`[standalone-assets] skipped missing ${source}`);
        return;
    }

    mkdirSync(dirname(target), { recursive: true });
    rmSync(target, { recursive: true, force: true });
    cpSync(source, target, { recursive: true });
    console.log(`[standalone-assets] copied ${source} -> ${target}`);
}

if (!existsSync(standaloneDir)) {
    throw new Error('Missing .next/standalone. Ensure next.config enables output: "standalone".');
}

copyDir('public', join(standaloneDir, 'public'));
copyDir(join('.next', 'static'), join(standaloneDir, '.next', 'static'));
