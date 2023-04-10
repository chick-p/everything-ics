import app from "../index";

describe("GET /", () => {
  it("should be ok", async () => {
    const res = await app.request("http://localhost/");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("everything-ics");
  });
});

describe("GET /ics", () => {
  it("should be 404 when url is undefined", async () => {
    const res = await app.request("http://localhost/ics" );
    expect(res.status).toBe(404);
    const body = await res.text();
    expect(body).toContain("404 Not Found");
  });
});
