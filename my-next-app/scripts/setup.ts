#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const requiredEnvVars = [
  'NEXT_PUBLIC_CLOUDFLARE_CLIENT_ID',
  'NEXT_PUBLIC_APP_URL',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID'
];

function checkEnvFile() {
  const envPath = join(rootDir, '.env.local');
  if (!existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('Creating .env.local file with required variables...');
    const envContent = requiredEnvVars.map(v => `${v}=""`).join('\n');
    writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file');
    console.log('Please fill in the required values in .env.local');
    return false;
  }

  const envContent = readFileSync(envPath, 'utf-8');
  const missingVars = requiredEnvVars.filter(v => !envContent.includes(`${v}=`));
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(v => console.log(`  - ${v}`));
    return false;
  }

  return true;
}

function main() {
  console.log('🔧 Running setup checks...');
  
  const envCheck = checkEnvFile();
  if (!envCheck) {
    process.exit(1);
  }

  console.log('✅ All checks passed!');
  console.log('🚀 You can now run `pnpm dev` to start the development server');
}

main(); 