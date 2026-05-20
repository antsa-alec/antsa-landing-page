import { renderToString } from 'react-dom/server';
import type { ComponentType } from 'react';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import { createCache, StyleProvider, extractStyle } from '@ant-design/cssinjs';
import Layout from './+Layout';

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

  // config.Head is a user-defined meta field; cast config to access it
  const config = pageContext.config as Record<string, unknown>;
  const HeadComp = config.Head as ComponentType<{ data: unknown }> | undefined;
  const headHtml = HeadComp ? renderToString(<HeadComp data={data} />) : '';

  return escapeInject`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${dangerouslySkipEscape(headHtml)}
    ${dangerouslySkipEscape(styleTag)}
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(appHtml)}</div>
  </body>
</html>`;
};

export default onRenderHtml;
