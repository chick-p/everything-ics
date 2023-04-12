import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { HTTPException } from "hono/http-exception";

import { Home } from "./pages/home";
import { generateIcs } from "./ics";
import { getFirstEventDate, getEventName } from "./extract";

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
    throw new HTTPException(400, { message: "url parameter is required" });
  }

  // prevent redirect
  let passedHostName;
  try {
    const { hostname } = new URL(url);
    passedHostName = hostname;
  } catch (e) {
    throw new HTTPException(500, { message: "bad url" });
  }
  if (host === passedHostName) {
    throw new HTTPException(400, { message: "forbidden url" });
  }

  const response = await fetch(url);
  if (!response.ok) {
    return context.notFound();
  }
  const body = await response.text();

  const title = getEventName(body);
  const date = getFirstEventDate(body);
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
