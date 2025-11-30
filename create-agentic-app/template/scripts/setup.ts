#!/usr/bin/env npx tsx
/**
 * Interactive setup wizard for the Agentic Coding Starter Kit.
 * Run with: npx tsx scripts/setup.ts
 */

import { existsSync, copyFileSync, readFileSync } from "fs";
import { createInterface } from "readline";
import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");
const ENV_EXAMPLE = join(ROOT_DIR, "env.example");
const ENV_FILE = join(ROOT_DIR, ".env");

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

function log(message: string, color?: keyof typeof colors) {
  const colorCode = color ? colors[color] : "";
  console.log(`${colorCode}${message}${colors.reset}`);
}

function header(message: string) {
  console.log();
  log(`${"=".repeat(60)}`, "cyan");
  log(`  ${message}`, "bright");
  log(`${"=".repeat(60)}`, "cyan");
  console.log();
}

function success(message: string) {
  log(`✓ ${message}`, "green");
}

function warn(message: string) {
  log(`⚠ ${message}`, "yellow");
}

function error(message: string) {
  log(`✗ ${message}`, "red");
}

function info(message: string) {
  log(`  ${message}`, "dim");
}

async function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${colors.cyan}? ${colors.reset}${question} `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function confirm(question: string): Promise<boolean> {
  const answer = await prompt(`${question} (y/n)`);
  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
}

function checkNodeVersion(): boolean {
  const requiredMajor = 20;
  const currentVersion = process.version;
  const currentMajor = parseInt(currentVersion.slice(1).split(".")[0] || "0", 10);

  if (currentMajor >= requiredMajor) {
    success(`Node.js ${currentVersion} detected (requires v${requiredMajor}+)`);
    return true;
  } else {
    error(`Node.js ${currentVersion} detected, but v${requiredMajor}+ is required`);
    info("Please upgrade Node.js: https://nodejs.org/");
    return false;
  }
}

function copyEnvFile(): boolean {
  if (existsSync(ENV_FILE)) {
    warn(".env file already exists");
    return true;
  }

  if (!existsSync(ENV_EXAMPLE)) {
    error("env.example file not found");
    return false;
  }

  try {
    copyFileSync(ENV_EXAMPLE, ENV_FILE);
    success("Created .env file from env.example");
    return true;
  } catch (err) {
    error(`Failed to create .env file: ${err}`);
    return false;
  }
}

interface EnvStatus {
  configured: string[];
  missing: string[];
  optional: string[];
}

function checkEnvVariables(): EnvStatus {
  const required = ["POSTGRES_URL", "BETTER_AUTH_SECRET"];
  const optional = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "OPENROUTER_API_KEY",
    "OPENROUTER_MODEL",
    "BLOB_READ_WRITE_TOKEN",
    "NEXT_PUBLIC_APP_URL",
  ];

  const status: EnvStatus = {
    configured: [],
    missing: [],
    optional: [],
  };

  // Read .env file if it exists
  let envContent = "";
  if (existsSync(ENV_FILE)) {
    envContent = readFileSync(ENV_FILE, "utf-8");
  }

  // Parse env file (simple key=value parsing)
  const envVars: Record<string, string> = {};
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key) {
        envVars[key] = valueParts.join("=");
      }
    }
  });

  // Check required variables
  for (const key of required) {
    const value = envVars[key];
    if (value && value.length > 0 && !value.startsWith("your-")) {
      status.configured.push(key);
    } else {
      status.missing.push(key);
    }
  }

  // Check optional variables
  for (const key of optional) {
    const value = envVars[key];
    if (value && value.length > 0 && !value.startsWith("your-")) {
      status.configured.push(key);
    } else {
      status.optional.push(key);
    }
  }

  return status;
}

async function runDatabaseMigration(): Promise<boolean> {
  log("\nRunning database migration...", "cyan");

  try {
    execSync("pnpm db:migrate", {
      cwd: ROOT_DIR,
      stdio: "inherit",
    });
    success("Database migration completed");
    return true;
  } catch {
    error("Database migration failed");
    info("Make sure your database is running and POSTGRES_URL is correct");
    return false;
  }
}

function printNextSteps(envStatus: EnvStatus) {
  header("Next Steps");

  const steps: string[] = [];

  if (envStatus.missing.length > 0) {
    steps.push(`Configure required env vars in .env: ${envStatus.missing.join(", ")}`);
  }

  if (envStatus.optional.includes("GOOGLE_CLIENT_ID")) {
    steps.push("Set up Google OAuth at https://console.cloud.google.com/");
  }

  if (envStatus.optional.includes("OPENROUTER_API_KEY")) {
    steps.push("Get an OpenRouter API key at https://openrouter.ai/settings/keys");
  }

  steps.push("Start the development server: pnpm dev");
  steps.push("Open http://localhost:3000 in your browser");

  steps.forEach((step, index) => {
    log(`${index + 1}. ${step}`);
  });

  console.log();
  log("Documentation:", "bright");
  info("- README.md - Project overview and setup");
  info("- CLAUDE.md - AI assistant guidelines");
  info("- docs/ - Technical documentation");
  console.log();
}

async function main() {
  header("Agentic Coding Starter Kit - Setup Wizard");

  // Step 1: Check Node version
  log("Checking Node.js version...", "cyan");
  if (!checkNodeVersion()) {
    process.exit(1);
  }

  // Step 2: Create .env file
  console.log();
  log("Setting up environment...", "cyan");
  copyEnvFile();

  // Step 3: Check environment variables
  console.log();
  log("Checking environment variables...", "cyan");
  const envStatus = checkEnvVariables();

  if (envStatus.configured.length > 0) {
    success(`Configured: ${envStatus.configured.join(", ")}`);
  }
  if (envStatus.missing.length > 0) {
    warn(`Missing (required): ${envStatus.missing.join(", ")}`);
  }
  if (envStatus.optional.length > 0) {
    info(`Optional (not set): ${envStatus.optional.join(", ")}`);
  }

  // Step 4: Offer to run database migration
  if (envStatus.missing.length === 0) {
    console.log();
    const shouldMigrate = await confirm("Would you like to run database migrations now?");
    if (shouldMigrate) {
      await runDatabaseMigration();
    }
  } else {
    console.log();
    warn("Skipping database migration - please configure required env vars first");
  }

  // Step 5: Print next steps
  printNextSteps(envStatus);

  log("Setup complete!", "green");
}

main().catch((err) => {
  error(`Setup failed: ${err}`);
  process.exit(1);
});
