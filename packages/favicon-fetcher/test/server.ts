import { setupServer } from 'msw/node';
import { http } from 'msw';

const bimiDnsResponse = {
  Answer: [
    {
      data: '"v=BIMI1; l=https://bimi.example.org/logo.svg;"'
    }
  ]
};
const bimiSvg = `<svg xmlns="http://www.w3.org/2000/svg"><text>BIMI</text></svg>`;

export const server = setupServer(
  http.get('https://www.google.com/s2/favicons', ({ request }) => {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain')

    if (!domain) {
      return new Response(null, { status: 404 })
    }

    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://icons.duckduckgo.com/ip3/reddit.com.ico', ({ request }) => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://icons.bitwarden.net/facebook.com/icon.png', ({ request }) => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://favicon.yandex.net/favicon/cloudflare.com', ({ request }) => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://www.fastmailcdn.com/avatar/joosup.com', ({ request }) => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://icon.horse/icon/github.com', () => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://icons.iocium.net/icon/arstechnica.com', () => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://favicon.is/discord.com', () => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://favicon.im/hey.com', () => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://favicon.controld.com/news.ycombinator.com', () => {
    return new Response(new ArrayBuffer(10), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),
  http.get('https://cloudflare-dns.com/dns-query', ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('name')?.startsWith('default._bimi.')) {
      return Response.json(bimiDnsResponse);
    }
    return Response.error(); // fallback
  }),
  http.get('https://dns.google/dns-query', ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('name')?.startsWith('default._bimi.')) {
      return Response.json(bimiDnsResponse);
    }
    return Response.error();
  }),
  http.get('https://bimi.example.org/logo.svg', () =>
    new Response(bimiSvg, {
      headers: {
        'Content-Type': 'image/svg+xml'
      }
    })
  )
);