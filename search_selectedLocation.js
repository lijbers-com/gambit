const fs = require('fs');

const filePath = '/Users/robertlijbers/Dev/gambit/src/components/layout/page-templates/line-item-detail.stories.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const results = [];

lines.forEach((line, index) => {
  // Look for "selectedLocation" that is NOT followed by 's'
  const regex = /selectedLocation(?!s)/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    results.push({
      line: index + 1,
      text: line.trim(),
      position: match.index
    });
  }
});

console.log('Found instances of "selectedLocation" (without "s"):');
console.log('='.repeat(60));
results.forEach(result => {
  console.log(`Line ${result.line}: ${result.text}`);
});

if (results.length === 0) {
  console.log('No instances of "selectedLocation" (without "s") found!');
}