import { Hono } from "hono";

import { generateIcs } from "./ics";

const extractRegex = (str: string, regex: RegExp): string => {
  const matcher = str.match(regex);
  if (matcher && matcher.length !== 0) {
    return matcher[1];
  }
  return "";
};

const getEventDate = (dateString: string): Date => {
  const dateArray = dateString.split(/\s/).join().replace(/日/, "").split(/月/);
  const [monthString, dayString] = dateArray;
  const date = new Date();
  date.setMonth(parseInt(monthString, 10) - 1);
  date.setDate(parseInt(dayString, 10));
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

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
  }
  const body = await response.text();

  const title = extractRegex(body, /<title>(.*?)<\/title>/);
  // HTML からそれっぽい日付を抽出
  const dateString = extractRegex(body, /(\d+\s*月\s*\d+\s*日)/);

  const ics = generateIcs({
    title,
    date: getEventDate(dateString),
    url,
  });
  return context.text(ics, 200, {
    "Content-Type": "text/calendar; charset=utf8",
  });
});

export default app;
