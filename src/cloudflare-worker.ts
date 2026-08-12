interface Env {
  ASSETS: Fetcher;
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' 'sha256-RnLovfi11dSRfXKPGmm694bsOijdsx21QMBUBYH6GM8=' https://www.googletagmanager.com https://fundingchoicesmessages.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google https://cloudflareinsights.com",
  "frame-src https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google",
  "form-action 'self' https://payment.ecpay.com.tw https://payment-stage.ecpay.com.tw",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/spare') {
      return Response.redirect(new URL('/spare/', url), 308);
    }

    // The existing site is published below /spare/. Static Assets are stored
    // at the Worker root, so remove that public prefix before resolving the
    // request. This keeps Vite's /spare/assets/... URLs working without a
    // duplicate asset upload.
    const assetRequest = url.pathname.startsWith('/spare/')
      ? new Request(new URL(`${url.pathname.slice('/spare'.length)}${url.search}`, url), request)
      : request;
    const response = await env.ASSETS.fetch(assetRequest);
    const headers = new Headers(response.headers);

    headers.set('Content-Security-Policy', contentSecurityPolicy);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
