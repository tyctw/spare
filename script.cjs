const fs = require('fs');
const file = 'src/components/layout/NavigationDrawer.tsx';
let code = fs.readFileSync(file, 'utf8');

const map = {
  find: { color: 'text-sky-600', bg: 'bg-sky-100' },
  choose: { color: 'text-amber-600', bg: 'bg-amber-100' },
  plan: { color: 'text-indigo-600', bg: 'bg-indigo-100' },
  membership: { color: 'text-violet-600', bg: 'bg-violet-100' },
  external: { color: 'text-violet-600', bg: 'bg-violet-100' },
  support: { color: 'text-rose-600', bg: 'bg-rose-100' },
  about: { color: 'text-emerald-600', bg: 'bg-emerald-100' }
};

let currentCategory = null;
const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/id:\s*'([a-z]+)'/);
  // Match category declaration like `id: 'find',` which is mostly alone on the line.
  if (match && !lines[i].includes('label:') && !lines[i].includes('action:')) {
    if (map[match[1]]) {
      currentCategory = match[1];
    }
  }
  
  if (currentCategory && lines[i].includes('action: {')) {
    lines[i] = lines[i].replace(/color:\s*'[^']+',\s*bg:\s*'[^']+'/, `color: '${map[currentCategory].color}', bg: '${map[currentCategory].bg}'`);
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Done');
