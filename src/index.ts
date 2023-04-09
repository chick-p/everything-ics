import { Hono } from "hono";


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

  return context.text(title);
});

export default app;
