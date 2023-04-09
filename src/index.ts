import { Hono } from "hono";

import { generateIcs } from "./ics";

const extractRegex = (str: string, regex: RegExp): string => {
  const matcher = str.match(regex);
  if (matcher && matcher.length !== 0) {
    return matcher[1];
  }
  return "";
};

const app = new Hono();

app.get("/", (context) => context.text("Hello 🔥"));

app.get("/ics", async (context) => {
  const url = context.req.query("url");
  if (!url) {
    return context.notFound();
  }
  const response = await fetch(url);
  if (!response.ok) {
  }
  const body = await response.text();
  const title = extractRegex(body, /<title>(.*?)<\/title>/);

  const ics = generateIcs({
    title,
    date: new Date(),
    url,
  });
  console.log(ics)


  return context.text(ics, 200, {
    "Content-Type": "text/calendar; charset=utf8",
  })
});

export default app;
