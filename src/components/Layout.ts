import { html } from "hono/html";

export const Layout = (props: { title: string; children: string }) =>
  html`<!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.title}</title>
        <link rel="stylesheet" href="/static/css/reset.css" />
        <link rel="stylesheet" href="/static/css/styles.css" />
        <link rel="icon" href="/static/favicon.svg" />
      </head>
      <body>
        <main class="c-main">
          <h1>🗓️ ${props.title}</h1>
          ${props.children}
        </main>
        <script src="/static/js/form.js"></script>
      </body>
    </html>`;
