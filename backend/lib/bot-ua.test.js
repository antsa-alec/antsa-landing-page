import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBotUA } from './bot-ua.js';

const BOT_UAS = [
  // LLM / AI scrapers — primary motivation
  'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot',
  'Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)',
  'Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)',
  'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
  'Mozilla/5.0 (compatible; Claude-Web/1.0; +https://www.anthropic.com)',
  'anthropic-ai',
  'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
  'Mozilla/5.0 (compatible; Perplexity-User/1.0)',
  'Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)',
  'Mozilla/5.0 (compatible; CCBot/2.0; +https://commoncrawl.org/faq/)',
  'Mozilla/5.0 (compatible; Google-Extended)',
  'Mozilla/5.0 (compatible; meta-externalagent/1.1)',
  'Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)',
  'Mozilla/5.0 (compatible; Amazonbot/0.1)',
  // Search engines
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 (compatible; DuckDuckBot/1.1; +http://duckduckgo.com/duckduckbot.html)',
  'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
  'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
  // Link previewers / social
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Mozilla/5.0 (compatible; Twitterbot/1.0)',
  'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
  'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
  'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
  'WhatsApp/2.23.20.0',
  'TelegramBot (like TwitterBot)',
  'Mozilla/5.0 (compatible; archive.org_bot +http://www.archive.org/details/archive.org_bot)',
];

const HUMAN_UAS = [
  // Real browsers — must NOT be treated as bots
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
];

for (const ua of BOT_UAS) {
  test(`bot: ${ua.slice(0, 60)}`, () => {
    assert.equal(isBotUA(ua), true);
  });
}

for (const ua of HUMAN_UAS) {
  test(`human: ${ua.slice(0, 60)}`, () => {
    assert.equal(isBotUA(ua), false);
  });
}

test('empty / missing UA -> not a bot (browsers always send one; absence is curl/health-check)', () => {
  assert.equal(isBotUA(undefined), false);
  assert.equal(isBotUA(null), false);
  assert.equal(isBotUA(''), false);
});

test('case-insensitive match', () => {
  assert.equal(isBotUA('gptbot'), true);
  assert.equal(isBotUA('CLAUDEBOT'), true);
});
