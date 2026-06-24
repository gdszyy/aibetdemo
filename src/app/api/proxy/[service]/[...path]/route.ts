import type { NextRequest } from 'next/server';

const SERVICE_TARGETS: Record<string, string> = {
    uof: process.env.API_PROXY_UOF_ORIGIN || 'https://xp-service-test1-api.helix.city',
    user: process.env.API_PROXY_USER_ORIGIN || 'https://xp-passport-test1-api.helix.city',
    payment: process.env.API_PROXY_PAYMENT_ORIGIN || 'https://xp-payment-test1-api.helix.city',
    game: process.env.API_PROXY_GAME_ORIGIN || 'https://xp-game-service-test1-api.helix.city',
    sport: process.env.API_PROXY_SPORT_ORIGIN || 'https://sport-api.helix.city/api',
    activity: process.env.API_PROXY_ACTIVITY_ORIGIN || 'https://mp-test1.helix.city/api/activity',
};

const HOP_BY_HOP_HEADERS = new Set([
    'connection',
    'content-length',
    'host',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
]);

type ProxyContext = {
    params: Promise<unknown>;
};

const buildProxyUrl = (origin: string, path: string[] | undefined, search: string) => {
    const target = new URL(origin.replace(/\/$/, ''));
    const pathname = path?.join('/') || '';
    target.pathname = `${target.pathname.replace(/\/$/, '')}/${pathname}`.replace(/\/$/, '') || '/';
    target.search = search;
    return target;
};

const buildProxyHeaders = (request: NextRequest) => {
    const headers = new Headers(request.headers);

    for (const header of HOP_BY_HOP_HEADERS) {
        headers.delete(header);
    }
    headers.set('x-forwarded-host', request.headers.get('host') || '');
    headers.set('x-forwarded-proto', request.nextUrl.protocol.replace(':', ''));

    return headers;
};

const buildResponseHeaders = (headers: Headers) => {
    const responseHeaders = new Headers(headers);

    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    responseHeaders.delete('transfer-encoding');

    return responseHeaders;
};

async function proxy(request: NextRequest, context: ProxyContext) {
    const { service, path } = (await context.params) as { service: string; path?: string[] };
    const origin = SERVICE_TARGETS[service];

    if (!origin) {
        return Response.json({ code: 404, message: `Unknown proxy service: ${service}`, data: null }, { status: 404 });
    }

    const targetUrl = buildProxyUrl(origin, path, request.nextUrl.search);
    const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer();

    const upstreamResponse = await fetch(targetUrl, {
        method: request.method,
        headers: buildProxyHeaders(request),
        body,
        redirect: 'manual',
        cache: 'no-store',
    });

    return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: buildResponseHeaders(upstreamResponse.headers),
    });
}

export function OPTIONS() {
    return new Response(null, { status: 204 });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
