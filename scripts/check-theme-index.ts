import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const THEME_PROVIDER = path.join(ROOT, 'src/components/theme-provider/theme-provider.tsx');
const SCHEME_META = path.join(ROOT, 'src/components/theme-provider/scheme-meta.ts');
const THEME_CSS = path.join(ROOT, 'src/assets/css/theme.css');
const BRAND_UI_SKIN = path.join(ROOT, 'src/components/theme-provider/brand-ui-skin.ts');
const THEME_INDEX_DOC = path.join(ROOT, 'docs/theme-reference-index.md');

interface SchemeMetaEntry {
    scheme: string;
    brand: string;
    mode: string;
}

const readText = (filePath: string) => fs.readFileSync(filePath, 'utf-8');

const uniq = <T>(items: T[]) => [...new Set(items)];

const extractSchemes = (content: string) => {
    const match = content.match(/export const SCHEMES = \[([\s\S]*?)\] as const;/);
    if (!match) return [];

    return uniq([...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
};

const extractCssSchemes = (content: string) => {
    const explicitSchemes = [...content.matchAll(/:root\.([a-z0-9-]+)\s*\{/g)].map((item) => item[1]);
    return uniq(['gtb', ...explicitSchemes]);
};

const extractSchemeMeta = (content: string) => {
    const entries = new Map<string, SchemeMetaEntry>();
    const entryPattern =
        /(?:^|\n)\s*(?:'([^']+)'|([a-zA-Z0-9_-]+)):\s*\{\s*scheme:\s*'([^']+)',\s*brand:\s*'([^']+)',\s*mode:\s*'([^']+)'/g;

    for (const match of content.matchAll(entryPattern)) {
        const key = match[1] ?? match[2];
        const [, , , scheme, brand, mode] = match;
        entries.set(key, { scheme, brand, mode });
    }

    return entries;
};

const extractIndexedSchemes = (content: string) => {
    const schemes = [...content.matchAll(/^\| `([^`]+)` \|/gm)].map((item) => item[1]);
    return uniq(schemes);
};

const extractSkinBody = (content: string, skinKey: string) => {
    const pattern = new RegExp(`const\\s+${skinKey}:\\s*BrandUiSkinStyle\\s*=\\s*\\{([\\s\\S]*?)\\n\\};`);
    return content.match(pattern)?.[1] ?? '';
};

const difference = (left: string[], right: string[]) => left.filter((item) => !right.includes(item));

const getSkinKey = ({ scheme, brand, mode }: SchemeMetaEntry) => {
    if (scheme === 'gtb') return 'GTB_UI_STYLE';
    if (brand === 'superbet') return mode === 'light' ? 'SUPERBET_LIGHT_UI_STYLE' : 'SUPERBET_UI_STYLE';
    if (brand === 'betano') return mode === 'light' ? 'BETANO_LIGHT_UI_STYLE' : 'BETANO_UI_STYLE';
    if (brand === 'betbus') return mode === 'light' ? 'BETBUS_LIGHT_UI_STYLE' : 'BETBUS_UI_STYLE';
    if (brand === 'match') return mode === 'light' ? 'MATCH_LIGHT_UI_STYLE' : 'MATCH_UI_STYLE';
    if (brand === 'glass') return mode === 'light' ? 'GLASS_LIGHT_UI_STYLE' : 'GLASS_DARK_UI_STYLE';
    if (brand === 'cis') return 'CIS_LIGHT_UI_STYLE';
    return 'SUPERBET_UI_STYLE';
};

const LIGHT_SKIN_REQUIRED_EXPLICIT_KEYS = [
    '--brand-match-card-bg',
    '--brand-match-card-border',
    '--brand-match-card-hover-bg',
    '--brand-match-card-shadow',
    '--brand-match-divider',
    '--brand-match-muted',
    '--brand-match-team-text',
    '--brand-match-league-text',
    '--brand-odds-bg',
    '--brand-odds-border',
    '--brand-odds-hover-bg',
    '--brand-odds-hover-border',
    '--brand-odds-name',
    '--brand-odds-value',
    '--brand-odds-selected-bg',
    '--brand-odds-selected-hover-bg',
    '--brand-odds-selected-text',
];

const formatList = (items: string[]) => (items.length > 0 ? items.join(', ') : 'none');

const pushMismatch = (errors: string[], label: string, expected: string[], actual: string[]) => {
    const missing = difference(expected, actual);
    const extra = difference(actual, expected);

    if (missing.length === 0 && extra.length === 0) return;

    errors.push(`${label}: missing [${formatList(missing)}], extra [${formatList(extra)}]`);
};

const main = () => {
    const registeredSchemes = extractSchemes(readText(THEME_PROVIDER));
    const cssSchemes = extractCssSchemes(readText(THEME_CSS));
    const schemeMeta = extractSchemeMeta(readText(SCHEME_META));
    const brandUiSkinContent = readText(BRAND_UI_SKIN);
    const indexedSchemes = extractIndexedSchemes(readText(THEME_INDEX_DOC));
    const metaSchemes = [...schemeMeta.keys()];

    const errors: string[] = [];

    pushMismatch(errors, 'SCHEMES vs theme.css', registeredSchemes, cssSchemes);
    pushMismatch(errors, 'SCHEMES vs scheme-meta.ts', registeredSchemes, metaSchemes);
    pushMismatch(errors, 'SCHEMES vs docs/theme-reference-index.md', registeredSchemes, indexedSchemes);

    for (const [key, meta] of schemeMeta) {
        if (key !== meta.scheme) {
            errors.push(`scheme-meta key mismatch: key "${key}" has scheme "${meta.scheme}"`);
        }
    }

    const skinGroups = new Map<string, string[]>();
    for (const scheme of registeredSchemes) {
        const meta = schemeMeta.get(scheme);
        if (!meta) continue;

        const skinKey = getSkinKey(meta);
        skinGroups.set(skinKey, [...(skinGroups.get(skinKey) ?? []), scheme]);
    }

    for (const [skinKey, schemes] of skinGroups) {
        if (!schemes.some((scheme) => schemeMeta.get(scheme)?.mode === 'light')) continue;

        const body = extractSkinBody(brandUiSkinContent, skinKey);
        if (!body) {
            errors.push(`brand skin missing: ${skinKey}`);
            continue;
        }

        const missingKeys = LIGHT_SKIN_REQUIRED_EXPLICIT_KEYS.filter((key) => !body.includes(`'${key}'`));
        if (missingKeys.length > 0) {
            errors.push(
                `${skinKey} must explicitly define light match card and odds tokens: missing [${formatList(missingKeys)}]`,
            );
        }
    }

    console.log('Theme index check');
    console.log(`- registered schemes: ${registeredSchemes.length} (${registeredSchemes.join(', ')})`);
    console.log(`- css schemes: ${cssSchemes.length} (${cssSchemes.join(', ')})`);
    console.log(`- indexed schemes: ${indexedSchemes.length} (${indexedSchemes.join(', ')})`);
    console.log('- shared brand skin groups:');
    for (const [skinKey, schemes] of skinGroups) {
        const note = schemes.length > 1 ? 'shared blast radius' : 'single scheme';
        console.log(`  - ${skinKey}: ${schemes.join(', ')} (${note})`);
    }

    if (errors.length > 0) {
        console.error('\nTheme index drift detected:');
        for (const error of errors) console.error(`- ${error}`);
        process.exitCode = 1;
        return;
    }

    console.log('\nTheme index is aligned.');
};

main();
