/**
 * Request-time clock for server-rendered ops pages. Wrapping Date.now keeps
 * the React purity lint honest about intent: these pages are force-dynamic
 * server components rendered once per request, so "now" is the request time.
 */
export const nowMs = () => Date.now();
