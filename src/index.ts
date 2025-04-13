import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { serveStatic } from "hono/cloudflare-workers";
import { HTTPException } from "hono/http-exception";
import manifest from "__STATIC_CONTENT_MANIFEST";

import { Home } from "./pages/home";
import { Edit } from "./pages/edit";
import { generateIcs } from "./ics";
import { escapeNewline, extractEventDates, extractEventName } from "./extract";
import { isValidPeriod } from "./date";

const app = new Hono();
app.get("/static/*", serveStatic({ root: "./", manifest }));

const appName = "everything-ics";
const cookieNameForError = `_${appName}_flash_error`;

app.get("/", (context) => {
  const host = context.req.raw.headers.get("host") || "";
  const htmlContent = Home({ appName, host });
  return context.html(htmlContent);
});

app.get("/ics", async (context) => {
  const host = context.req.raw.headers.get("host");
  const url = context.req.query("url");
  const error = getCookie(context, cookieNameForError) || "";
  setCookie(context, cookieNameForError, "");
  if (!url) {
    throw new HTTPException(400, { message: "url parameter is required" });
  }

  const encodedUrl = encodeURI(escapeNewline(url));

  // prevent redirect
  let passedHostName;
  try {
    const { hostname } = new URL(encodedUrl);
    passedHostName = hostname;
  } catch {
    throw new HTTPException(500, { message: "bad url" });
  }
  if (host === passedHostName) {
    throw new HTTPException(400, { message: "forbidden url" });
  }

  const response = await fetch(encodedUrl);
  if (!response.ok) {
    return context.notFound();
  }
  const body = await response.text();

  const title = extractEventName(body);
  const dates = extractEventDates(body);
  if (!dates || dates.length === 0) {
    throw new HTTPException(400, { message: "date not found" });
  }
  const event = {
    title,
    candidateDates: dates,
    url: encodedUrl,
  };
  const htmlContent = Edit({ appName, event }, error);
  return context.html(htmlContent);
});

app.get("/ics/download", async (context) => {
  const title = context.req.query("title");
  const from = context.req.query("from");
  const to = context.req.query("to") || from;
  const url = context.req.query("url");
  const isMultipleDates = context.req.query("isMultipleDates") || "0";
  if (
    typeof title !== "string" ||
    typeof from !== "string" ||
    typeof to !== "string" ||
    typeof url !== "string" ||
    typeof isMultipleDates !== "string"
  ) {
    throw new HTTPException(400, { message: "bad request" });
  }
  let ics: string;

  if (isMultipleDates === "0") {
    ics = generateIcs({
      title: escapeNewline(title),
      from,
      to,
      url,
    });
  } else {
    if (!isValidPeriod(from, to)) {
      setCookie(context, cookieNameForError, "'From' must be before 'To'.");
      return context.redirect(`/ics?url=${url}`, 301);
    }
    ics = generateIcs({
      title: escapeNewline(title),
      from,
      to,
      url,
    });
  }
  return context.text(ics, 200, {
    "Content-Type": "text/calendar; charset=utf8",
    "Content-Disposition": 'attachment; filename="calendar.ics"',
  });
});

export default app;
