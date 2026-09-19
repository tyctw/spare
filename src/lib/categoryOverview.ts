export const categoryOverviewPaths = {
  find: '/guide/find',
  choose: '/guide/choose',
  scoring: '/guide/scoring',
  plan: '/guide/plan',
  member: '/guide/member',
  help: '/guide/help',
} as const;

export type CategoryOverviewId = keyof typeof categoryOverviewPaths;

