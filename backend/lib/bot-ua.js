// Single regex matched case-insensitively against the User-Agent.
// Token list curated for the bots that (a) do not execute JS and (b) we
// actively want to serve the SEO body to: LLM scrapers, search engines,
// link previewers, and archivers.
//
// Update notes:
// - When a new AI scraper appears, add its UA token here.
// - Bots that DO execute JS (e.g. modern Googlebot) are still included —
//   serving them the pre-injected body is cheap and removes a render hop.
const BOT_UA_RE = new RegExp(
  [
    // LLM / AI training & retrieval
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Bytespider',
    'CCBot',
    'Google-Extended',
    'meta-externalagent',
    'Amazonbot',
    'Applebot',
    'YouBot',
    'cohere-ai',
    'Diffbot',
    // Search engines
    'Googlebot',
    'bingbot',
    'DuckDuckBot',
    'YandexBot',
    'Baiduspider',
    'Sogou',
    'Exabot',
    // Social / link previewers
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'LinkedInBot',
    'Slackbot',
    'Discordbot',
    'TelegramBot',
    'WhatsApp',
    'SkypeUriPreview',
    'Embedly',
    // Archivers / monitoring
    'archive\\.org_bot',
    'ia_archiver',
    'Pingdom',
    // Generic fallthroughs — last so specific names rank in logs
    // Word-boundary anchors prevent false matches on substrings like
    // 'iRobot', 'Bothersome', 'SpiderMan'.
    '\\bbot\\b',
    '\\bcrawler\\b',
    '\\bspider\\b',
  ].join('|'),
  'i',
);

export function isBotUA(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return false;
  return BOT_UA_RE.test(userAgent);
}
