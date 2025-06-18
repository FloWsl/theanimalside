#!/usr/bin/env node

// Quick ESLint fixes for CI/CD
const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/HomePage/DiscoveryGateway/ConservationDiscoveryFeed.tsx',
  'src/components/HomePage/DiscoveryGateway/index.tsx', 
  'src/components/HomePage/GetStartedSection.tsx',
  'src/components/HomePage/HeroSection.tsx',
  'src/components/HomePage/index.tsx',
  'src/utils/organizationMapping.ts'
];

console.log('🔧 Applying quick ESLint fixes...');

filesToFix.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove unused imports
    content = content.replace(/import.*{[^}]*useEffect[^}]*}.*from 'react';\n/g, match => {
      if (content.includes('useEffect(')) return match;
      return match.replace(/, useEffect|useEffect, |useEffect/g, '');
    });
    
    content = content.replace(/import.*{[^}]*Link[^}]*}.*from 'react-router-dom';\n/g, match => {
      if (content.includes('<Link')) return match;
      return match.replace(/, Link|Link, |Link/g, '');
    });
    
    // Comment out unused variables
    content = content.replace(/const\s+(\w+)\s*=.*(?=\n)/g, (match, varName) => {
      const isUsed = new RegExp(`\\b${varName}\\b`).test(content.slice(content.indexOf(match) + match.length));
      if (!isUsed && !match.includes('//')) {
        return `// ${match}`;
      }
      return match;
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${file}`);
  }
});

console.log('✅ Quick fixes applied!');