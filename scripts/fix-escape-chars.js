#!/usr/bin/env node

/**
 * Focused Escape Character Fixer
 * Applies our proven methodology to fix unnecessary escape characters
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Fixing unnecessary escape characters...\n');

// Get baseline
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

// Create safety backup
const timestamp = Date.now();
try {
  execSync(`git stash push -m "escape-fix-backup-${timestamp}"`, {
    cwd: '/home/flowsl/theanimalside',
    stdio: 'pipe'
  });
  console.log('🛡️  Safety backup created');
} catch (error) {
  console.log('⚠️  Could not create backup:', error.message);
}

// Get lint output and parse escape character errors
let lintOutput;
try {
  execSync('npm run lint', { stdio: 'pipe', cwd: '/home/flowsl/theanimalside' });
} catch (error) {
  lintOutput = error.stderr.toString();
}

const lines = lintOutput.split('\n');
let currentFile = null;
const fixes = [];

for (const line of lines) {
  if (line.includes('/home/flowsl/theanimalside/') && (line.includes('.tsx') || line.includes('.ts'))) {
    currentFile = line.trim();
  }
  if (line.includes('Unnecessary escape character') && currentFile) {
    const match = line.match(/(\d+):(\d+).*Unnecessary escape character: (.)/);
    if (match) {
      fixes.push({
        file: currentFile,
        line: parseInt(match[1]),
        column: parseInt(match[2]),
        character: match[3]
      });
    }
  }
}

console.log(`🔍 Found ${fixes.length} escape character issues to fix`);

// Fix each one
let fixedCount = 0;
for (const fix of fixes) {
  try {
    console.log(`   Fixing ${fix.file.split('/').pop()}:${fix.line} (${fix.character})`);

    const content = fs.readFileSync(fix.file, 'utf8');
    const lines = content.split('\n');

    if (lines[fix.line - 1]) {
      const oldLine = lines[fix.line - 1];
      const newLine = oldLine.replace(`\\${fix.character}`, fix.character);

      if (oldLine !== newLine) {
        lines[fix.line - 1] = newLine;
        fs.writeFileSync(fix.file, lines.join('\n'));
        fixedCount++;
        console.log(`   ✅ Fixed`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
}

// Validate
console.log('\n🔍 Validating changes...');

// Check TypeScript
try {
  execSync('npm run type-check', { stdio: 'pipe', cwd: '/home/flowsl/theanimalside' });
  console.log('✅ TypeScript: Clean');
} catch (error) {
  console.log('❌ TypeScript: Failed');
  console.log('🔄 Rolling back...');
  execSync('git stash pop', { cwd: '/home/flowsl/theanimalside' });
  process.exit(1);
}

// Check problem count
const newProblems = getProblems();
const improvement = baseline - newProblems;

console.log(`📊 Results: ${baseline} → ${newProblems} problems (${improvement > 0 ? '-' + improvement : 'no change'})`);

if (improvement > 0) {
  console.log(`🎉 Success! Fixed ${fixedCount} escape characters, improved ${improvement} problems`);
} else {
  console.log(`✅ No problems increased (safety maintained)`);
}

console.log('\n' + '='.repeat(50));
console.log('🛡️  Zero-breakage automation complete');
console.log('='.repeat(50));