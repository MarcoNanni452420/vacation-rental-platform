import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Bot and spam referrer blocking
    const referer = req.headers.get('referer') || '';
    const userAgent = req.headers.get('user-agent') || '';

    // Block patterns for spam referrers
    const blockedPatterns = [
      // Game-related spam patterns
      /game\.(top|xyz|com|vip|work|fun|online)/i,
      /\w+game\.top/i,
      /play.*\.(xyz|com|top|vip)/i,
      /h5\.(com|top)/i,
      
      // Specific spam domains from Vercel Analytics
      'pilegame.top', 'jollyreef.com', 'metagame.top', 
      'newstop10.xyz', 'macxcsecplay.xyz', 'gattbi.site',
      'ganped.top', 'f9game.top', 'quickracingh5.com',
      'qczpxd.com', 'sdfgame.com', 'susuh5.com',
      'fkery.top', 'blackbison.shop', 'hushenjio.top',
      'magicclub72.com', 'tasuvspy.work', 'epicgaminghub.one',
      'flavorvoyage.net', 'immomovip.com', 'freeaolgames.com',
      'freemixgames.com', 'funsupergames.fun', 'aiioalo.com',
      'gamekilo.com', 'gameroomie.com', 'gamerunman.com',
      'hzdqnj.xyz', 'gragragame.com', 'conquertj.com',
      'h5joybox.com', 'heeval.space', 'helldiversgame.xyz',
      'finsafely.com', 'gamexnet.com', 'funngame.vip',
      'tapminifun.com', 'joymv.top', 'minigame.vip',
      'laughcraze.com', 'youngbattle.com', 'myzone9.com',
      'infopathwaypage.com', 'goallocity.com', 'kanziggame.work',
      'xgcrypto.xyz', 'karwia.xyz', 'playmystic.com',
      'pawneygame.com', 'varoxigame.com', 'resumetrud.com',
      'vpzfp.top', 'dbankcloud.com', 'ppgbu.top',
      'taikangdasha.com', 'gamevitas.com', 'dievengame.online',
      'yohogames.top', // Aggiunto per catturare nowifimini.yohogames.top
      'secbeiinfo.com', 'fzap.secbeiinfo.com', // Nuovo spam domain
      'elmpeesapk.xyz', // Nuovo spam domain
      'inchcalculator.com', 'gameswan.pro', 'baingp.top', 'radio-ao-vivo.com', // Nuovi spam domains
      'greenhealthy.top', 'eyebuydirect.com', 'urbangamex.top', 'forever21.ca', // Nuovi spam domains
      'gamethundernovax.top', 'gfuel.com', 'newzo.top', // Altri spam domains
      'gameforclick.com', 'macxdvd.com', 'sportzbonanza.com', 'topfreegamebox.com', // Nuovi spam domains
      'yojanalive.online', // Blocca play300.yojanalive.online e tutti i sottodomini
      'magicclub49.com', // Blocca for.magicclub49.com, safe.magicclub49.com e tutti i sottodomini
      'mbgame.bar', // Blocca super.mbgame.bar e tutti i sottodomini
      'xxvptre.today', // Blocca puzzly.xxvptre.today e tutti i sottodomini
      'dtrsqhubwn.com', 'gfgje.com', 'magiczjc.com', 'magicclub41.com', // Nuovi spam
      'zrpve.com', 'fgcpve.com', 'puzzgo27.lol', 'gceuh.com', // Altri spam
      'cashifycity.com', 'itil4hub.com', 'partakemessage.com', 'vetvai.biz', // Altri spam
      // NOTE: NON bloccare: googleadservices.com, pagead2.googlesyndication.com, youtube.com,
      // google.com, syndicatedsearch.goog, googleads.g.doubleclick.net, poki.com (tutti legittimi)
      
      // SEO spam sites
      'semalt.com', 'buttons-for-website.com', 'darodar.com',
      'best-seo-offer.com', '7makemoneyonline.com',
      'videos-for-your-business.com', 'success-seo.com',
      'get-free-traffic-now.com', 'free-social-buttons.com'
    ];

    // Allowed search engine bots (whitelist)
    const allowedBots = [
      'Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 
      'facebookexternalhit', 'LinkedInBot', 'WhatsApp',
      'Twitterbot', 'Applebot', 'YandexBot'
    ];

    // Blocked user agents
    const blockedUserAgents = [
      'AhrefsBot', 'MJ12bot', 'SEMrushBot', 'DotBot', 
      'BLEXBot', 'LinkpadBot', 'MauiBot', 'serpstatbot',
      'PetalBot', 'Bytespider', 'python-requests', 
      'Go-http-client', 'Java/', 'curl/', 'wget/'
    ];

    // Check if referrer matches any blocked pattern
    const isBlockedReferrer = blockedPatterns.some(pattern => {
      if (typeof pattern === 'string') {
        // Check if the referrer contains the pattern or ends with it (for subdomains)
        return referer.includes(pattern) || 
               referer.toLowerCase().endsWith(pattern) ||
               referer.toLowerCase().includes('.' + pattern);
      }
      return pattern.test(referer);
    });
    
    // Check if it's an allowed bot first
    const isAllowedBot = allowedBots.some(bot => 
      userAgent.includes(bot)
    );

    // Also check if request has no referer but suspicious user agent
    const hasNoReferer = !referer || referer === '';
    const isSuspiciousNoReferer = hasNoReferer && userAgent && !isAllowedBot && (
      userAgent.includes('bot') || 
      userAgent.includes('spider') || 
      userAgent.includes('crawler') ||
      userAgent.length < 20 // Very short user agents are often bots
    );

    // Check if user agent is blocked
    const isBlockedBot = blockedUserAgents.some(bot => 
      userAgent.toLowerCase().includes(bot.toLowerCase())
    );

    // Block spam traffic (but not allowed bots)
    if (!isAllowedBot && (isBlockedReferrer || isBlockedBot || isSuspiciousNoReferer)) {
      // Log blocked attempts in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Blocked request:', {
          referer,
          userAgent,
          reason: isBlockedReferrer ? 'blocked_referrer' : isBlockedBot ? 'blocked_bot' : 'suspicious_no_referer'
        });
      }
      
      return new Response('Access Denied', { 
        status: 403,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow',
          'X-Blocked-Reason': isBlockedReferrer ? 'referrer' : isBlockedBot ? 'bot' : 'suspicious'
        }
      });
    }

    // Generate CSP nonce for security using Web Crypto API
    const nonce = crypto.randomUUID().replace(/-/g, '')
    
    // Admin routes protection - ONLY admin routes need authentication
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    const response = NextResponse.next({
      request: {
        headers: (() => {
          const requestHeaders = new Headers(req.headers)
          requestHeaders.set('x-nonce', nonce)
          return requestHeaders
        })(),
      },
    })
    
    // Add nonce to response headers
    response.headers.set('x-nonce', nonce)
    
    // CSP disabled for now - will re-enable later
    // const isDevelopment = process.env.NODE_ENV === 'development'
    // const cspValue = [
    //   "default-src 'self'",
    //   `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https://maps.googleapis.com https://maps.google.com https://www.googletagmanager.com`,
    //   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
    //   "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://a0.muscache.com https://ui-avatars.com",
    //   "font-src 'self' https://fonts.gstatic.com data:",
    //   "connect-src 'self' https://*.googleapis.com https://maps.google.com https://www.google-analytics.com https://api.octorateplus.com",
    //   "frame-src https://www.google.com/maps/",
    //   "object-src 'none'",
    //   "base-uri 'self'",
    //   "form-action 'self' https://api.octorateplus.com",
    //   "frame-ancestors 'none'",
    //   "require-trusted-types-for 'script'",
    //   "trusted-types default nextjs webpack-chunk next-dynamic",
    //   "report-uri /api/csp-report"
    // ].join('; ')
    // 
    // response.headers.set('Content-Security-Policy', cspValue)
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Only admin routes require authentication - all others are public
        if (pathname.startsWith("/admin")) {
          return !!token && token.role === "ADMIN"
        }

        // All other routes are public
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // Admin routes need authentication
    "/admin/:path*",
    // All routes need nonce for CSP
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}