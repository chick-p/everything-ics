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
