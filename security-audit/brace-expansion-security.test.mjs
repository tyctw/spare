import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const packages = [
  ['brace-expansion', '1.1.21'],
  ['readdir-glob/node_modules/brace-expansion', '2.1.7'],
];

for (const [name, version] of packages) {
  test(`${name}: patched version, normal expansion and bounded hostile patterns`, () => {
    assert.equal(require(`${name}/package.json`).version, version);
    const expand = require(name);
    assert.deepEqual(expand('school-{a,b}-{1..3}'), [
      'school-a-1', 'school-a-2', 'school-a-3',
      'school-b-1', 'school-b-2', 'school-b-3',
    ]);
    // Isolate hostile inputs so a future vulnerable dependency cannot hang
    // the test runner or terminate it with stack exhaustion.
    const script = `
      const expand = require(${JSON.stringify(require.resolve(name))});
      expand('{' + '{a},'.repeat(7000) + 'b}');
      expand('{a}' + '}'.repeat(64000) + ',z}');
      expand('{'.repeat(16000) + 'a' + '}'.repeat(16000));
    `;
    execFileSync(process.execPath, ['-e', script], { timeout: 4000 });
  });
}

test('ExcelJS can export and reload an XLSX through updated archive dependencies', async () => {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet('志願清單').addRow(['機械科', '電子科']);
  const output = await workbook.xlsx.writeBuffer();
  const restored = new ExcelJS.Workbook();
  await restored.xlsx.load(output);
  assert.equal(restored.getWorksheet('志願清單').getCell('A1').value, '機械科');
  assert.equal(restored.getWorksheet('志願清單').getCell('B1').value, '電子科');
});
