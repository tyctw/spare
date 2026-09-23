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
  const searchParams = new URLSearchParams(window.location.search);
  const liffState = getLiffStateLocation();
  if (liffState) return routeFromLocation_(liffState.pathname);

  const redirectedRoute = searchParams.get('route');
  if (redirectedRoute) return normalizeRoute(redirectedRoute);

  return routeFromLocation_(window.location.pathname);
};

function routeFromLocation_(pathname: string) {
  const cleanPathname = pathname.replace(/\/+$/, '') || '/';
  const baseWithoutSlash = appBasePath.replace(/\/+$/, '') || '/';

  if (baseWithoutSlash !== '/' && (cleanPathname === baseWithoutSlash || cleanPathname.startsWith(`${baseWithoutSlash}/`))) {
    return normalizeRoute(cleanPathname.slice(baseWithoutSlash.length) || '/');
  }

  return normalizeRoute(cleanPathname);
}

/** LIFF puts a deep-link suffix in `liff.state` while redirecting to the
 * configured endpoint. Read only same-origin paths and ignore malformed or
 * external values. */
export const getLiffStateLocation = () => {
  const raw = new URLSearchParams(window.location.search).get('liff.state');
  if (!raw) return null;
  try {
    const target = new URL(raw, window.location.origin);
    if (target.origin !== window.location.origin || target.pathname.startsWith('//')) return null;
    return target;
  } catch {
    return null;
  }
};
