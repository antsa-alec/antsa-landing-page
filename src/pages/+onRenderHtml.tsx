import { renderToString } from 'react-dom/server';
import type { ComponentType } from 'react';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import { createCache, StyleProvider, extractStyle } from '@ant-design/cssinjs';
import Layout from './+Layout';
import DefaultHead from './+Head';

const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const { Page, data } = pageContext;
  if (!Page) throw new Error('No Page component provided by Vike');

  // Cast Page to a typed component — Vike types it as `{}` in 0.4.x
  const PageComponent = Page as ComponentType<Record<string, unknown>>;

  const cache = createCache();
  const appHtml = renderToString(
    <StyleProvider cache={cache}>
      <Layout pageContext={pageContext}>
        <PageComponent {...((data as Record<string, unknown>) ?? {})} />
      </Layout>
    </StyleProvider>,
  );
  const styleTag = extractStyle(cache);

  // Always render the default Head (Organization/OG/Twitter/gtag JSON-LD).
  const defaultHeadHtml = renderToString(<DefaultHead />);

  // config.Head is a page-level override set via +Head.tsx in each page directory.
  // When present it is different from DefaultHead, so render it after the default
  // so that page-specific <title> and <link rel="canonical"> override the defaults
  // (last value wins in browsers for duplicate tags).
  const config = pageContext.config as Record<string, unknown>;
  const PageHead = config.Head as ComponentType<{ data: unknown }> | undefined;
  const pageHeadHtml =
    PageHead && PageHead !== (DefaultHead as unknown)
      ? renderToString(<PageHead data={data} />)
      : '';

  return escapeInject`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${dangerouslySkipEscape(defaultHeadHtml)}
    ${dangerouslySkipEscape(pageHeadHtml)}
    ${dangerouslySkipEscape(styleTag)}
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(appHtml)}</div>
  </body>
</html>`;
};

export default onRenderHtml;
