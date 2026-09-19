import { scheduleMonths } from './importantDates';

const scheduleYear = 2027;
const taipeiDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
});

export const scheduleEvents = scheduleMonths.flatMap(group => group.rows.flatMap(row =>
  row.items.map(item => {
    // An individual item can have a different range from its shared date heading.
    const inlineRange = item.match(/^(\d{2}\/\d{2}–\d{2}\/\d{2})：/);
    const dates = [...(inlineRange?.[1] ?? row.date).matchAll(/(\d{2})\/(\d{2})/g)]
      .map(match => `${scheduleYear}-${match[1]}-${match[2]}`);
    const start = dates[0];
    let end = dates[1] ?? start;
    // The source lists opening and closing separately for this selection window.
    if (item === '各就學區免試入學開放個人序位查詢及志願選填') end = `${scheduleYear}-06-24`;
    return { title: item.replace(/^\d{2}\/\d{2}–\d{2}\/\d{2}：/, ''), start, end };
  })
));

export function getScheduleAnnouncement(now = new Date()) {
  const parts = taipeiDate.formatToParts(now);
  const part = (type: string) => parts.find(value => value.type === type)!.value;
  const today = `${part('year')}-${part('month')}-${part('day')}`;
  const active = scheduleEvents.filter(event => event.start <= today && today <= event.end)
    .sort((a, b) => a.end.localeCompare(b.end) || a.start.localeCompare(b.start));
  const upcoming = scheduleEvents.filter(event => event.start > today)
    .sort((a, b) => a.start.localeCompare(b.start));
  const event = active[0] ?? upcoming[0];
  if (!event) return { status: '已結束', message: '116 學年度已公告日程皆已結束，後續招生資訊請留意各管道公告。' };
  const format = (date: string) => `${Number(date.slice(0, 4)) - 1911}/${date.slice(5).replace('-', '/')}`;
  const dateLabel = event.start === event.end ? format(event.start) : `${format(event.start)}–${format(event.end)}`;
  return { status: active.length ? '進行中' : '即將到來', message: `${dateLabel}｜${event.title}` };
}
