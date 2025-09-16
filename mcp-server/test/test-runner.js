#!/usr/bin/env node

import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Test runner for Physics Daily MCP Server
 * Runs all unit and integration tests
 */

console.log('🧪 Physics Daily MCP Server Test Suite');
console.log('=====================================\n');

const testDirs = ['unit', 'integration'];
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const dir of testDirs) {
  const testDir = join(__dirname, dir);
  
  try {
    const testFiles = readdirSync(testDir).filter(file => file.endsWith('.test.js'));
    
    if (testFiles.length === 0) {
      console.log(`📁 ${dir}/: No test files found\n`);
      continue;
    }
    
    console.log(`📁 Running ${dir} tests:`);
    console.log('-'.repeat(30));
    
    for (const file of testFiles) {
      const testPath = join(testDir, file);
      console.log(`🔍 ${file}`);
      
      try {
        // Import and run test file
        await import(testPath);
        console.log(`✅ ${file} - PASSED`);
        passedTests++;
      } catch (error) {
        console.log(`❌ ${file} - FAILED`);
        console.error(`   Error: ${error.message}`);
        if (process.env.NODE_ENV === 'development') {
          console.error(`   Stack: ${error.stack}`);
        }
        failedTests++;
      }
      totalTests++;
    }
    
    console.log(''); // Empty line between test directories
  } catch (error) {
    console.log(`📁 ${dir}/: Directory not accessible`);
    console.log('');
  }
}

// Print summary
console.log('📊 Test Summary');
console.log('===============');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${failedTests} ❌`);
console.log(`Success Rate: ${totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%`);

if (failedTests > 0) {
  console.log('\n❌ Some tests failed. Check the output above for details.');
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
}