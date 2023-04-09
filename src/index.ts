import { Hono } from "hono";

const app = new Hono();
app.get("/", (context) => context.text("Hello 🔥"));

app.get("/ics", async (context) => {
  const url = context.req.query("url");
  if(!url) {
    return context.notFound();
  }
  const response = await fetch(url);
  if(!response.ok) {
    return context.notFound();
  }
  const body = await response.text();
  return context.text(body);
});

export default app;
