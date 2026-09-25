// Run against an isolated PostgreSQL-compatible PGlite engine, never production.
// Usage: node account-deletion.test.mjs <path-to-pglite/dist/index.js>
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const sql = text => db.exec(text);
const rows = async text => (await db.query(text)).rows;
const migrate = async file => sql(await fs.readFile(`supabase/migrations/${file}.sql`, 'utf8'));
try {
  await sql(`create role anon; create role authenticated; create role service_role;
    create table public.line_login_sessions(token uuid default gen_random_uuid(), line_user_id text, cookie_only boolean default true, expires_at timestamptz default now()+interval '1 day');
    create table public.membership_payments(line_user_id text, status text, expires_at timestamptz, updated_at timestamptz default now());`);
  for (const file of [
    '20260805000100_add_shared_reports',
    '20260906000100_add_volunteer_share_collaboration',
    '20260906000200_add_member_score_records',
    '20260906000300_harden_member_score_records',
    '20260906000500_harden_volunteer_share_access',
    '20260908000100_add_volunteer_versions',
    '20260925000100_delete_account_owned_shares',
  ]) await migrate(file);
  await sql(`insert into line_login_sessions(line_user_id) values ('delete-me'), ('other'), ('paid');
    insert into membership_payments(line_user_id,status,expires_at) values ('delete-me','paid',now()-interval '1 day'),('paid','paid',now()+interval '1 day');
    insert into member_score_records(line_user_id,record_type,title,scores) values ('delete-me','mock','test','{}'),('other','mock','test','{}');
    insert into shared_reports(token,kind,payload,owner_line_user_id,collaboration_key) values
    ('11111111-1111-4111-8111-111111111111','volunteer','{"choices":[]}','delete-me','22222222-2222-4222-8222-222222222222'),
    ('33333333-3333-4333-8333-333333333333','analysis','{}','other',null),
    ('44444444-4444-4444-8444-444444444444','analysis','{}',null,null),
    ('55555555-5555-4555-8555-555555555555','analysis','{}','paid',null);
    insert into shared_report_collaboration_events(report_token,event_type,actor_name) values ('11111111-1111-4111-8111-111111111111','comment','test');
    insert into volunteer_versions(report_token,version,choices,actor_name) values ('11111111-1111-4111-8111-111111111111',1,'[]','test');`);
  assert.equal((await rows(`select delete_membership_account('paid') as result`))[0].result, false);
  assert.equal((await rows(`select count(*)::int as n from shared_reports where owner_line_user_id='paid'`))[0].n, 1);
  assert.equal((await rows(`select delete_membership_account(null) as result`))[0].result, false);
  assert.equal((await rows(`select delete_membership_account(' ') as result`))[0].result, false);
  // Force a later operation to fail: earlier share deletion must roll back.
  await sql(`create function fail_score_delete() returns trigger language plpgsql as $$ begin raise exception 'TEST_ROLLBACK'; end $$;
    create trigger test_rollback before delete on member_score_records for each row execute function fail_score_delete();`);
  await assert.rejects(rows(`select delete_membership_account('delete-me')`), /TEST_ROLLBACK/);
  assert.equal((await rows(`select count(*)::int as n from volunteer_versions`))[0].n, 1);
  await sql('drop trigger test_rollback on member_score_records;');
  assert.equal((await rows(`select delete_membership_account('delete-me') as result`))[0].result, true);
  for (const table of ['shared_report_collaboration_events','volunteer_versions']) {
    assert.equal((await rows(`select count(*)::int as n from ${table}`))[0].n, 0);
  }
  assert.equal((await rows(`select count(*)::int as n from shared_reports where token='11111111-1111-4111-8111-111111111111'`))[0].n, 0);
  await assert.rejects(rows(`select manage_volunteer_version('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','history')`), /SHARE_UNAVAILABLE/);
  for (const table of ['line_login_sessions','member_score_records','membership_payments']) {
    assert.equal((await rows(`select count(*)::int as n from ${table} where line_user_id='delete-me'`))[0].n, 0);
  }
  assert.equal((await rows(`select count(*)::int as n from shared_reports`))[0].n, 3);
  assert.equal((await rows(`select count(*)::int as n from member_score_records where line_user_id='other'`))[0].n, 1);
  // Simulate a request that passed the HTTP session check before deletion.
  await assert.rejects(sql(`insert into shared_reports(kind,payload,owner_line_user_id) values ('analysis','{}','delete-me')`), /SHARE_OWNER_SESSION_EXPIRED/);
  await assert.rejects(sql(`update shared_reports set owner_line_user_id='delete-me' where owner_line_user_id='other'`), /SHARE_OWNER_SESSION_EXPIRED/);
  for (const role of ['anon','authenticated']) {
    assert.equal((await rows(`select has_function_privilege('${role}', 'public.delete_membership_account(text)', 'EXECUTE') as allowed`))[0].allowed, false);
  }
  assert.equal((await rows(`select has_function_privilege('service_role', 'public.delete_membership_account(text)', 'EXECUTE') as allowed`))[0].allowed, true);
  console.log('PASS: actual migration execution, cascade cleanup, old read/editor token invalidation, other-owner isolation, active-member refusal, blank identity refusal, transaction rollback, stale share writes rejected, RPC permissions.');
  console.log('Limitation: single-connection PGlite; multi-connection lock scheduling and production schema were not exercised.');
} finally { await db.close(); }
