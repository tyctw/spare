// Heuristic scan: reports only locations/rule names, never credential values.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const rules = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/g],
  ['google-api-key', /\bAIza[A-Za-z0-9_-]{35}\b/g],
  ['openai-key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}\b/g],
  ['aws-access-id', /\bAKIA[A-Z0-9]{16}\b/g],
  ['supabase-secret', /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g],
];
function scan(text) {
  const matches = rules.filter(([,r]) => { r.lastIndex = 0; return r.test(text); }).map(([name])=>name);
  for (const token of text.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) || []) {
    try { if (JSON.parse(Buffer.from(token.split('.')[1], 'base64url')).role === 'service_role') matches.push('service-role-jwt'); } catch {}
  }
  return [...new Set(matches)];
}
const files = execFileSync('git', ['ls-files','-z'], {encoding:'utf8'}).split('\0').filter(Boolean);
const findings = [];
for (const file of files) {
  if (!fs.existsSync(file) || fs.statSync(file).size > 5e6) continue;
  const hits = scan(fs.readFileSync(file,'utf8'));
  if (hits.length) findings.push({file, rules: hits});
}
const history = execFileSync('git', ['log','--all','-p','--format=commit %H','--no-ext-diff'], {encoding:'utf8',maxBuffer:200*1024*1024});
const result = { trackedFiles: files.length, currentFindings: findings, historyRulesMatched: scan(history), historyDiffBytes: Buffer.byteLength(history), limitation:'High-confidence formats only; arbitrary passwords, untracked files, binary history, remote secrets and reflogs are not covered.' };
fs.writeFileSync('security-audit/secret-scan-results.json', JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
