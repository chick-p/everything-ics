import app from "../index";

describe("GET /", () => {
  it("should be ok", async () => {
    const res = await app.request("http://localhost/");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("everything-ics");
  });
});
