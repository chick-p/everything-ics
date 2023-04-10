import { Hono } from "hono";

import { generateIcs } from "./ics";
import { extractDate, extractRegex } from "./extract";

const app = new Hono();

app.get("/", (context) => {
  const host = context.req.headers.get("host");
  const name = "everything-ics";
  return context.html(
    `<html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${name}</title>
      </head>
      <body>
        <h1>${name}</h1>
        <h2>How to setup shortcut</h2>
        <ol>
          <li>Copy your Cloudflare Worker URL:<br><code>https://${host}</code></li>
          <li>
            Download
            <a href="https://www.icloud.com/shortcuts/89d7146ce6be463eb2f4a039eed37a8a">
              iOS Shortcut
            </a> and add it to your iPhone.
          </li>
          <li>Set your Cloudflare Worker URL.</li>
        </ol>
        <h2>How to use</h2>
        <ol>
          <li>Open an event page on your browser.</li>
          <li>Open Share Sheet and tap "${name}".<br>
              In the first time, accept to access your Cloudflare Worker URL.</li>
          <li>Add an event to your calendar.</li>
        </ol>
      </body>
    </html>
    `
  );
});

app.get("/ics", async (context) => {
  const host = context.req.headers.get("host");
  const url = context.req.query("url");
  if (!url) {
    return context.notFound();
  }
  // prevent redirect
  if (url.startsWith(`https://${host}`)) {
    return context.notFound();
  }
  const response = await fetch(url);
  if (!response.ok) {
    return context.notFound();
  }
  const body = await response.text();

  const title = extractRegex(body, /<title>(.*?)<\/title>/);
  const date = extractDate(body);

  const ics = generateIcs({
    title,
    date,
    url,
  });
  return context.text(ics, 200, {
    "Content-Type": "text/calendar; charset=utf8",
  });
});

export default app;
