import fs from 'fs';
import path from 'path';

// Recursively find all files in a directory
function getFiles(dir: string): string[] {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

// Collect translation keys from code
function collectCodeKeys(srcDir: string): Set<string> {
  const codeFiles = getFiles(srcDir).filter(
    (f) =>
      (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) &&
      !f.includes('locales') &&
      !f.includes('data'),
  );
  const keys = new Set<string>();
  const tRegex =
    /\bt\s*\(\s*(["'`])([^"'`\[\{]+)\1\s*\)|\bt\s*\(\s*\[\s*(["'`])([^"'`]+)\3\s*\]\s*\)|\bt\s*\(\s*\{[^}]*key\s*:\s*(["'`])([^"'`]+)\5[^}]*\}\s*\)/g;
  for (const file of codeFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = tRegex.exec(content)) !== null) {
      const key = match[2] || match[4] || match[6];
      if (key && !key.includes('${')) {
        keys.add(key);
      }
    }
  }
  return keys;
}

// Recursively collect keys of an object, using dot notation for all leaf nodes
function collectJsonKeys(obj: any, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return [];
  }
  const keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys.push(...collectJsonKeys(obj[k], next));
    } else {
      keys.push(next);
    }
  }
  return keys;
}

// Main
const srcDir = path.resolve(process.cwd(), 'src');
const localesDir = path.resolve(process.cwd(), 'src', 'locales');
const folders = fs
  .readdirSync(localesDir)
  .filter((f) => fs.statSync(path.join(localesDir, f)).isDirectory());

const codeKeys = collectCodeKeys(srcDir);
const localeKeysByLang: Record<string, Set<string>> = {};

for (const folder of folders) {
  const filePath = path.join(localesDir, folder, 'translation.json');
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    const obj = JSON.parse(content);
    const keys = collectJsonKeys(obj);
    localeKeysByLang[folder] = new Set(keys);
  } catch (e) {
    console.error(`Error parsing ${folder}/translation.json:`, e);
  }
}

let report = '# Translation Check Report\n';
report += `\n## Keys found in code (${codeKeys.size})\n`;
codeKeys.forEach((k) => (report += `- ${k}\n`));

for (const lang of Object.keys(localeKeysByLang)) {
  const localeKeys = localeKeysByLang[lang];
  report += `\n## Keys in translation.json for ${lang} (${localeKeys.size})\n`;
  localeKeys.forEach((k) => (report += `- ${k}\n`));

  // Comparison
  const missingInLocale = [...codeKeys].filter((k) => !localeKeys.has(k));
  const unusedInLocale = [...localeKeys].filter((k) => !codeKeys.has(k));

  report += `\n### Keys used in code but missing in ${lang}/translation.json\n`;
  if (missingInLocale.length) {
    missingInLocale.forEach((k) => (report += `- ${k}\n`));
  } else {
    report += 'None\n';
  }

  report += `\n### Keys in ${lang}/translation.json but not used in code\n`;
  if (unusedInLocale.length) {
    unusedInLocale.forEach((k) => (report += `- ${k}\n`));
  } else {
    report += 'None\n';
  }
}

fs.writeFileSync('reporttranslationcheck.md', report);
console.log('Translation check report written to reporttranslationcheck.md');
