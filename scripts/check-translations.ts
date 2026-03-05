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

// helper for nested paths
function setNested(obj: any, pathStr: string, value: string) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      cur[p] = value;
    } else {
      if (typeof cur[p] !== 'object' || cur[p] === null) {
        cur[p] = {};
      }
      cur = cur[p];
    }
  }
}

let issueFound = false;
let addedKeys: Record<string, string[]> = {};

for (const folder of folders) {
  const fileKeys = allKeysByFile[folder] || new Set();
  const missing = [...allLocaleKeys].filter((k) => !fileKeys.has(k));
  if (missing.length) {
    issueFound = true;
    addedKeys[folder] = addedKeys[folder] || [];
    missing.forEach((k) => addedKeys[folder].push(k));
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
    const key = match[2] || match[4] || match[6];
    if (key && !key.includes('${')) {
      keysInCode.add(key);
    }
  }
}

const englishKeys = allKeysByFile['en'] || new Set();
const missingFromLocales = [...keysInCode].filter((k) => !englishKeys.has(k));

// gather union of code keys and locale keys
const unionKeys = new Set<string>([...allLocaleKeys, ...keysInCode]);

// load objects for all locales so we can modify
const localeObjs: Record<string, any> = {};
for (const folder of folders) {
  const filePath = path.join(localesDir, folder, 'translation.json');
  if (fs.existsSync(filePath)) {
    try {
      localeObjs[folder] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      // ignore, already reported above
      localeObjs[folder] = {};
    }
  } else {
    localeObjs[folder] = {};
  }
}

// ensure english contains all code keys first
if (missingFromLocales.length) {
  issueFound = true;
  addedKeys['en'] = addedKeys['en'] || [];
  missingFromLocales.forEach((k) => addedKeys['en'].push(k));
}

for (const key of unionKeys) {
  for (const folder of folders) {
    const fileKeys = allKeysByFile[folder] || new Set();
    if (!fileKeys.has(key)) {
      issueFound = true;
      addedKeys[folder] = addedKeys[folder] || [];
      addedKeys[folder].push(key);
    }
  }
}

// actually add keys with placeholder values
for (const folder of folders) {
  const obj = localeObjs[folder];
  const fileKeys = allKeysByFile[folder] || new Set();
  const toAdd = addedKeys[folder] || [];
  if (toAdd.length) {
    toAdd.forEach((k) => {
      // determine default value
      let val = '';
      if (folder === 'en') {
        // english uses the key itself (or if missing from english but present in other locale, use that value?)
        val = k;
      } else {
        // other languages: try to mirror english if available
        const engObj = localeObjs['en'] || {};
        // get english value by delving into engObj
        const parts = k.split('.');
        let cur = engObj;
        for (const p of parts) {
          if (cur && typeof cur === 'object' && p in cur) {
            cur = cur[p];
          } else {
            cur = undefined;
            break;
          }
        }
        if (typeof cur === 'string') {
          val = cur;
        } else {
          val = '';
        }
      }
      setNested(obj, k, val);
    });
    // write file back
    const filePath = path.join(localesDir, folder, 'translation.json');
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n');
    console.log(`\n[Auto-Add] Added ${toAdd.length} missing keys to ${folder}/translation.json`);
  }
}

console.log(`\nFound ${keysInCode.size} unique translation keys in code.`);

if (missingFromLocales.length) {
  console.log('\n[Code Sync] Keys found in code but missing from locales:');
  missingFromLocales.sort().forEach((k) => console.log(`  - ${k}`));
}

if (!issueFound) {
  console.log('\nSuccess: All translation keys are synchronized.');
  process.exit(0);
} else {
  console.log('\nOne or more translation files were updated automatically.');
  console.log('Please review and supply appropriate translations before committing.');
  process.exit(1);
}
