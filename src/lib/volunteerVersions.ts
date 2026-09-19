export type VersionChoice = { code: string; deptCode: string; shift?: string; name: string; deptName: string; [key: string]: unknown };
export type VolunteerVersion = { version: number; choices: VersionChoice[]; created_at: string; actor_name: string; note: string };
export function compareVolunteerChoices(before: VersionChoice[], after: VersionChoice[]) {
  const indexed = (list: VersionChoice[]) => {
    const occurrences = new Map<string, number>();
    return list.map((choice, index) => {
      const base = JSON.stringify([choice.code, choice.deptCode, choice.shift || '']);
      const occurrence = occurrences.get(base) || 0;
      occurrences.set(base, occurrence + 1);
      return { key: `${base}:${occurrence}`, choice, rank: index + 1 };
    });
  };
  const old = indexed(before), next = indexed(after);
  const oldMap = new Map(old.map(x => [x.key, x])), nextMap = new Map(next.map(x => [x.key, x]));
  return {
    added: next.filter(x => !oldMap.has(x.key)), removed: old.filter(x => !nextMap.has(x.key)),
    moved: next.filter(x => oldMap.has(x.key) && oldMap.get(x.key)!.rank !== x.rank)
      .map(x => ({ ...x, from: oldMap.get(x.key)!.rank })),
  };
}
