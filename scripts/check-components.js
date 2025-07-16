#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const UI_DIR = path.join(__dirname, '../src/components/ui');
const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function checkComponentsAndStories() {
  log(COLORS.blue + COLORS.bold, '🔍 Checking Component Documentation...\n');
  
  if (!fs.existsSync(UI_DIR)) {
    log(COLORS.red, '❌ UI components directory not found!');
    return false;
  }

  const files = fs.readdirSync(UI_DIR);
  const components = files.filter(file => file.endsWith('.tsx') && !file.endsWith('.stories.tsx'));
  const stories = files.filter(file => file.endsWith('.stories.tsx'));
  
  let allGood = true;
  let componentsWithStories = 0;
  let componentsWithoutStories = 0;

  log(COLORS.blue, `Found ${components.length} components and ${stories.length} story files\n`);

  // Check each component has a corresponding story
  components.forEach(component => {
    const componentName = component.replace('.tsx', '');
    const expectedStory = `${componentName}.stories.tsx`;
    const hasStory = stories.includes(expectedStory);
    
    if (hasStory) {
      log(COLORS.green, `✅ ${componentName} - Story exists`);
      componentsWithStories++;
    } else {
      log(COLORS.red, `❌ ${componentName} - Missing story file: ${expectedStory}`);
      componentsWithoutStories++;
      allGood = false;
    }
  });

  // Check for orphaned stories (stories without components)
  const orphanedStories = stories.filter(story => {
    const componentName = story.replace('.stories.tsx', '.tsx');
    return !components.includes(componentName);
  });

  if (orphanedStories.length > 0) {
    log(COLORS.yellow, '\n⚠️  Orphaned story files (no corresponding component):');
    orphanedStories.forEach(story => {
      log(COLORS.yellow, `   - ${story}`);
    });
  }

  // Check index.ts exports
  const indexPath = path.join(UI_DIR, 'index.ts');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const missingExports = components.filter(component => {
      const componentName = component.replace('.tsx', '');
      // Check for both single and double quotes, and with/without ./ prefix
      return !indexContent.includes(`"${componentName}"`) && 
             !indexContent.includes(`'${componentName}'`) &&
             !indexContent.includes(`"./${componentName}"`) &&
             !indexContent.includes(`'./${componentName}'`);
    });

    if (missingExports.length > 0) {
      log(COLORS.red, '\n❌ Components missing from index.ts:');
      missingExports.forEach(component => {
        const componentName = component.replace('.tsx', '');
        log(COLORS.red, `   - export * from "./${componentName}"`);
      });
      allGood = false;
    } else {
      log(COLORS.green, '\n✅ All components are exported in index.ts');
    }
  } else {
    log(COLORS.red, '\n❌ Missing index.ts file!');
    allGood = false;
  }

  // Summary
  log(COLORS.blue + COLORS.bold, '\n📊 Summary:');
  log(COLORS.green, `✅ Components with stories: ${componentsWithStories}`);
  if (componentsWithoutStories > 0) {
    log(COLORS.red, `❌ Components without stories: ${componentsWithoutStories}`);
  }
  if (orphanedStories.length > 0) {
    log(COLORS.yellow, `⚠️  Orphaned stories: ${orphanedStories.length}`);
  }

  if (allGood) {
    log(COLORS.green + COLORS.bold, '\n🎉 All components are properly documented in Storybook!');
  } else {
    log(COLORS.red + COLORS.bold, '\n🚨 Some components are missing Storybook documentation!');
    log(COLORS.blue, '\n📚 Remember: If it\'s not in Storybook, it doesn\'t exist!');
    log(COLORS.blue, '   Visit http://localhost:6006 to verify your components');
  }

  return allGood;
}

// Run the check
const success = checkComponentsAndStories();
process.exit(success ? 0 : 1); 