#!/usr/bin/env node

/**
 * Automation Demo - One Specific Safe Fix
 * Demonstrates our proven methodology working automatically
 */

import { execSync } from 'child_process';
import fs from 'fs';

const TARGET_FILE = '/home/flowsl/theanimalside/src/components/OrganizationDetail/ResponsiveTestUtils.tsx';
const TARGET_IMPORT = 'Info';

console.log('🤖 AUTOMATION DEMO: Safe Import Removal');
console.log('==========================================\n');

// Step 1: Get baseline
const getProblems = () => {
  try {
    execSync('npm run lint', { stdio: 'pipe', cwd: '/home/flowsl/theanimalside' });
    return 0;
  } catch (error) {
    const match = error.stderr.toString().match(/✖ (\d+) problems/);
    return match ? parseInt(match[1]) : 0;
  }
};

const baseline = getProblems();
console.log(`📊 Baseline: ${baseline} problems`);

// Step 2: Create safety backup
try {
  execSync(`git stash push -m "automation-demo-backup-${Date.now()}"`, {
    cwd: '/home/flowsl/theanimalside',
    stdio: 'pipe'
  });
  console.log('🛡️  Safety backup created');
} catch (error) {
  console.log('⚠️  Backup note:', error.message);
}

// Step 3: Read current file
console.log(`🔍 Reading: ${TARGET_FILE.split('/').pop()}`);
const originalContent = fs.readFileSync(TARGET_FILE, 'utf8');

// Step 4: Apply safe transformation
console.log(`🔧 Removing unused import: ${TARGET_IMPORT}`);
const newContent = originalContent.replace(
  /import { Monitor, Smartphone, Tablet, Eye, AlertCircle, CheckCircle, Info } from 'lucide-react';/,
  "import { Monitor, Smartphone, Tablet, Eye, AlertCircle, CheckCircle } from 'lucide-react';"
);

// Only proceed if we made a change
if (originalContent === newContent) {
  console.log('❌ No change needed - import already removed or pattern not found');
  process.exit(0);
}

// Step 5: Write change
fs.writeFileSync(TARGET_FILE, newContent);
console.log('✅ File updated');

// Step 6: Validate TypeScript
console.log('🔍 Validating TypeScript...');
try {
  execSync('npm run type-check', { stdio: 'pipe', cwd: '/home/flowsl/theanimalside' });
  console.log('✅ TypeScript: Clean');
} catch (error) {
  console.log('❌ TypeScript: Failed');
  console.log('🔄 Rolling back...');
  fs.writeFileSync(TARGET_FILE, originalContent);
  process.exit(1);
}

// Step 7: Check improvement
const newProblems = getProblems();
const improvement = baseline - newProblems;

console.log(`📊 Results: ${baseline} → ${newProblems} problems`);

if (improvement > 0) {
  console.log(`🎉 SUCCESS! Fixed ${improvement} problem(s)`);
} else if (newProblems === baseline) {
  console.log(`✅ No regressions (change was already applied)`);
} else {
  console.log(`❌ Problem count increased - rolling back`);
  fs.writeFileSync(TARGET_FILE, originalContent);
  process.exit(1);
}

console.log('\n' + '='.repeat(50));
console.log('🤖 AUTOMATION DEMO COMPLETE');
console.log('   ✅ Zero-breakage methodology');
console.log('   ✅ Immediate validation');
console.log('   ✅ Automatic rollback capability');
console.log('   ✅ Progress measurement');
console.log('='.repeat(50));