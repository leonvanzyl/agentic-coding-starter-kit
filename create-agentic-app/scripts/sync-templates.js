#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

console.log(`${colors.blue}📋 Syncing template from main project...${colors.reset}\n`);

// Paths
const scriptDir = __dirname;
const packageDir = path.dirname(scriptDir); // create-agentic-app
const projectRoot = path.dirname(packageDir); // main project root
const templateDir = path.join(packageDir, 'template');

// Files and directories to exclude
const excludePatterns = [
  'node_modules',
  '.next',
  '.git',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'tsconfig.tsbuildinfo',
  '.env',
  'create-agentic-app'
];

// Check if a path should be excluded
function shouldExclude(filePath) {
  const relativePath = path.relative(projectRoot, filePath);
  return excludePatterns.some(pattern => relativePath.includes(pattern));
}

// Recursively copy directory with exclusions
async function copyWithExclusions(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  await fs.ensureDir(dest);

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (shouldExclude(srcPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      await copyWithExclusions(srcPath, destPath);
    } else {
      await fs.copy(srcPath, destPath, { overwrite: true });
    }
  }
}

// Main sync function
async function sync() {
  try {
    // Remove existing template directory
    console.log(`${colors.yellow}🗑️  Cleaning template directory...${colors.reset}`);
    await fs.remove(templateDir);
    await fs.ensureDir(templateDir);

    // Copy files
    console.log(`${colors.cyan}📦 Copying project files...${colors.reset}`);
    await copyWithExclusions(projectRoot, templateDir);

    // Explicitly copy .gitignore file as _gitignore (npm excludes .gitignore by default)
    console.log(`${colors.cyan}📄 Copying .gitignore as _gitignore...${colors.reset}`);
    const gitignoreSrc = path.join(projectRoot, '.gitignore');
    const gitignoreDest = path.join(templateDir, '_gitignore');
    if (await fs.pathExists(gitignoreSrc)) {
      await fs.copy(gitignoreSrc, gitignoreDest, { overwrite: true });
      console.log(`${colors.green}✓${colors.reset} .gitignore copied as _gitignore`);
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} .gitignore not found in project root`);
    }

    // Process template package.json
    console.log(`${colors.cyan}⚙️  Updating template package.json...${colors.reset}`);
    const templatePackageJsonPath = path.join(templateDir, 'package.json');

    if (await fs.pathExists(templatePackageJsonPath)) {
      const packageJson = await fs.readJson(templatePackageJsonPath);

      // Remove private field
      delete packageJson.private;

      // Remove sync-template script if it exists
      if (packageJson.scripts && packageJson.scripts['sync-template']) {
        delete packageJson.scripts['sync-template'];
      }

      // Write back the cleaned package.json
      await fs.writeJson(templatePackageJsonPath, packageJson, { spaces: 2 });
      console.log(`${colors.green}✓${colors.reset} Removed "private" field and sync script`);
    }

    console.log(`\n${colors.green}✨ Template sync complete!${colors.reset}`);
    console.log(`${colors.cyan}📁 Template directory: ${templateDir}${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.yellow}❌ Error syncing template:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run sync
sync();
