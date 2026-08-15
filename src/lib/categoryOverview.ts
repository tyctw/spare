export const categoryOverviewPaths = {
  find: '/guide/find',
  choose: '/guide/choose',
  plan: '/guide/plan',
  member: '/guide/member',
  help: '/guide/help',
} as const;

export type CategoryOverviewId = keyof typeof categoryOverviewPaths;

