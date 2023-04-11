import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";

import { Home } from "./pages/home";
import { generateIcs } from "./ics";
import { extractDate, extractRegex } from "./extract";

const app = new Hono();
app.get("/static/*", serveStatic({ root: "./" }));

const appName = "everything-ics";

app.get("/", (context) => {
  const host = context.req.headers.get("host") || "";
  const htmlContent = Home({ appName, host });
  return context.html(htmlContent);
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

  if (!date) {
    return context.notFound();
  }

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
