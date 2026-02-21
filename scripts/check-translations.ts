/* eslint-disable func-style, @typescript-eslint/no-explicit-any, no-console */
import fs from 'fs';
import path from 'path';

// Recursively collect keys of an object, using dot notation for all leaf nodes
function collectKeys(obj: any, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return [];
  }
  const keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys.push(...collectKeys(obj[k], next));
    } else {
      keys.push(next);
    }
  }
  return keys;
}

// Recursively find all files in a directory
function getFiles(dir: string): string[] {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

const localesDir = path.resolve(process.cwd(), 'src', 'locales');
const folders = fs
  .readdirSync(localesDir)
  .filter((f) => fs.statSync(path.join(localesDir, f)).isDirectory());
const allKeysByFile: Record<string, Set<string>> = {};

for (const folder of folders) {
  const filePath = path.join(localesDir, folder, 'translation.json');
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    const obj = JSON.parse(content);
    const keys = collectKeys(obj);
    allKeysByFile[folder] = new Set(keys);
  } catch (e) {
    console.error(`Error parsing ${folder}/translation.json:`, e);
  }
}

// 1. Cross-reference keys between locale files
const allLocaleKeys = new Set<string>();
for (const s of Object.values(allKeysByFile)) {
  s.forEach((k) => allLocaleKeys.add(k));
}

let issueFound = false;
for (const folder of folders) {
  const fileKeys = allKeysByFile[folder] || new Set();
  const missing = [...allLocaleKeys].filter((k) => !fileKeys.has(k));
  if (missing.length) {
    issueFound = true;
    console.log(`\n[Locale Sync] Missing keys in ${folder}:`);
    missing.forEach((k) => console.log(`  - ${k}`));
  }
}

// 2. Scan codebase for t('key') usage
console.log('\nScanning codebase for translation key usage...');
const srcDir = path.resolve(process.cwd(), 'src');
const codeFiles = getFiles(srcDir).filter(
  (f) =>
    (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) &&
    !f.includes('locales') &&
    !f.includes('data'),
);

const keysInCode = new Set<string>();
// Enhanced regex to match:
// t('key'), t("key"), t(`key`), t(["key"]), t(['key']), t({ key: "key" })
const tRegex =
  /\bt\s*\(\s*(["'`])([^"'`\[\{]+)\1\s*\)|\bt\s*\(\s*\[\s*(["'`])([^"'`]+)\3\s*\]\s*\)|\bt\s*\(\s*\{[^}]*key\s*:\s*(["'`])([^"'`]+)\5[^}]*\}\s*\)/g;

for (const file of codeFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = tRegex.exec(content)) !== null) {
    // match[2]: t('key'), t("key"), t(`key`)
    // match[4]: t(["key"]), t(['key'])
    // match[6]: t({ key: "key" })
    const key = match[2] || match[4] || match[6];
    if (key && !key.includes('${')) {
      keysInCode.add(key);
    }
  }
}

const englishKeys = allKeysByFile['en'] || new Set();
const missingFromLocales = [...keysInCode].filter((k) => !englishKeys.has(k));

console.log(`\nFound ${keysInCode.size} unique translation keys in code.`);

if (missingFromLocales.length) {
  issueFound = true;
  console.log('\n[Code Sync] Keys found in code but missing from locales:');
  missingFromLocales.sort().forEach((k) => console.log(`  - ${k}`));
}

if (!issueFound) {
  console.log('\nSuccess: All translation keys are synchronized.');
  process.exit(0);
} else {
  process.exit(1);
}
