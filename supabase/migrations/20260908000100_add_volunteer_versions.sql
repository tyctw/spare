create table public.volunteer_versions (
  report_token uuid not null references public.shared_reports(token) on delete cascade,
  version integer not null,
  choices jsonb not null,
  actor_name text not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  primary key (report_token, version)
);
alter table public.volunteer_versions enable row level security;
revoke all on public.volunteer_versions from public, anon, authenticated;

-- Capture the current baseline; older contents cannot be reconstructed from events.
insert into public.volunteer_versions(report_token, version, choices, actor_name, note)
select token, collaboration_version, coalesce(payload->'choices', '[]'::jsonb), '系統', '版本功能啟用時的清單'
from public.shared_reports where kind = 'volunteer' and collaboration_key is not null;

create function public.manage_volunteer_version(
  p_token uuid, p_key uuid, p_action text, p_expected integer default null,
  p_actor text default '', p_choices jsonb default null, p_restore integer default null,
  p_note text default ''
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  r public.shared_reports%rowtype;
  v_choices jsonb;
  v_note text;
  v_now timestamptz;
begin
  select * into r from public.shared_reports where token = p_token for update;
  v_now := clock_timestamp();
  if not found or r.kind <> 'volunteer' or r.collaboration_key is null
    or p_key is null or r.collaboration_key <> p_key or r.revoked_at is not null
    or (r.expires_at is not null and r.expires_at <= clock_timestamp()) then
    raise exception 'SHARE_UNAVAILABLE';
  end if;
  insert into public.volunteer_versions(report_token, version, choices, actor_name, note)
  values(r.token, r.collaboration_version, coalesce(r.payload->'choices','[]'::jsonb), '系統', '起始清單')
  on conflict do nothing;
  if p_action = 'history' then
    return jsonb_build_object('choices', r.payload->'choices', 'version', r.collaboration_version,
      'confirmedAt',r.collaboration_confirmed_at,'confirmedBy',r.collaboration_confirmed_by,
      'events',coalesce((select jsonb_agg(to_jsonb(e) - 'report_token' order by created_at desc)
        from (select * from public.shared_report_collaboration_events where report_token = p_token order by created_at desc limit 100) e),'[]'::jsonb),
      'versions', coalesce((select jsonb_agg(to_jsonb(v) - 'report_token' order by version desc)
      from (select * from public.volunteer_versions where report_token = p_token order by version desc limit 100) v), '[]'::jsonb));
  end if;
  if nullif(trim(p_actor),'') is null or length(p_actor) > 24 or length(p_note) > 800 then raise exception 'INVALID_INPUT'; end if;
  if p_action = 'comment' then
    if nullif(trim(p_note),'') is null then raise exception 'INVALID_INPUT'; end if;
    insert into public.shared_report_collaboration_events(report_token,event_type,actor_name,message,version)
    values(p_token,'comment',p_actor,p_note,r.collaboration_version);
    return jsonb_build_object('added',true);
  end if;
  if p_expected is null or p_expected <> r.collaboration_version then raise exception 'VERSION_CONFLICT'; end if;
  if p_action = 'confirm' then
    update public.shared_reports set collaboration_confirmed_at = v_now, collaboration_confirmed_by = p_actor where token = p_token;
    insert into public.shared_report_collaboration_events(report_token,event_type,actor_name,message,version)
    values(p_token,'confirmed',p_actor,'確認目前版本',r.collaboration_version);
    return jsonb_build_object('confirmedAt',v_now,'confirmedBy',p_actor,'version',r.collaboration_version);
  end if;
  if p_action = 'restore' then
    select choices into v_choices from public.volunteer_versions where report_token = p_token and version = p_restore;
    if not found then raise exception 'VERSION_NOT_FOUND'; end if;
    v_note := '還原第 ' || p_restore || ' 版';
  elsif p_action = 'save' then
    v_choices := p_choices;
    v_note := coalesce(nullif(trim(p_note),''),'更新志願清單');
  else raise exception 'INVALID_ACTION'; end if;
  if v_choices is null or jsonb_typeof(v_choices) <> 'array' then raise exception 'INVALID_INPUT'; end if;
  if jsonb_array_length(v_choices) > 30 then raise exception 'INVALID_INPUT'; end if;
  update public.shared_reports set payload = jsonb_set(r.payload,'{choices}',v_choices),
    collaboration_version = r.collaboration_version + 1,
    collaboration_confirmed_at = null, collaboration_confirmed_by = null where token = p_token;
  insert into public.volunteer_versions(report_token,version,choices,actor_name,note)
  values(p_token,r.collaboration_version+1,v_choices,p_actor,v_note);
  insert into public.shared_report_collaboration_events(report_token,event_type,actor_name,message,version)
  values(p_token,'revision',p_actor,v_note,r.collaboration_version+1);
  return jsonb_build_object('choices',v_choices,'version',r.collaboration_version+1);
end;
$$;
revoke all on function public.manage_volunteer_version(uuid,uuid,text,integer,text,jsonb,integer,text) from public,anon,authenticated;
grant execute on function public.manage_volunteer_version(uuid,uuid,text,integer,text,jsonb,integer,text) to service_role;
