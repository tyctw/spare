const configuredBase = import.meta.env.BASE_URL || '/';

export const appBasePath =
  configuredBase === './'
    ? '/'
    : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');

const normalizeRoute = (route: string) => {
  const clean = route.trim();
  if (!clean || clean === '/') return '/';
  return `/${clean.replace(/^\/+/, '').replace(/\/+$/, '')}`;
};

export const withBasePath = (route = '/') => {
  if (/^(https?:|mailto:|tel:|#)/.test(route)) return route;
  const normalizedRoute = normalizeRoute(route);
  if (normalizedRoute === '/') return appBasePath;
  return `${appBasePath}${normalizedRoute.replace(/^\/+/, '')}`;
};

export const getCurrentRoutePath = () => {
  const redirectedRoute = new URLSearchParams(window.location.search).get('route');
  if (redirectedRoute) return normalizeRoute(redirectedRoute);

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const baseWithoutSlash = appBasePath.replace(/\/+$/, '') || '/';

  if (baseWithoutSlash !== '/' && (pathname === baseWithoutSlash || pathname.startsWith(`${baseWithoutSlash}/`))) {
    return normalizeRoute(pathname.slice(baseWithoutSlash.length) || '/');
  }

  return normalizeRoute(pathname);
};
