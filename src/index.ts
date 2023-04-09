import { Hono } from "hono";

const app = new Hono();
app.get("/", (context) => context.text("Hello 🔥"));

app.get("/ics", (context) => {
  const url = context.req.query("url");
  return context.text(`url: ${url}`);
});

export default app;
