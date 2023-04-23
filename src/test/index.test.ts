import app from "../index";

const appServer = "http://localhost";
const exampleServer = "https://example.com";

describe("GET /", () => {
  it("should be ok", async () => {
    const res = await app.request(`${appServer}/`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("everything-ics");
  });
});

describe("GET /ics", () => {
  beforeAll(() => {
    // mock cloudflare workers fetch
    const fetchMock = getMiniflareFetchMock();
    fetchMock.disableNetConnect();
    const origin = fetchMock.get(exampleServer);
    origin.intercept({ method: "GET", path: "/404" }).reply(404, "not found");
    origin.intercept({ method: "GET", path: "/nodate" }).reply(200, "no date");
    origin.intercept({ method: "GET", path: "/date" }).reply(200, "3月9日");
  });

  it("should be 400 when url is undefined", async () => {
    const res = await app.request(`${appServer}/ics`);
    expect(res.status).toBe(400);
    const body = await res.text();
    expect(body).toContain("url parameter is required");
  });

  it("should be 400 when prevent redirect", async () => {
    const host = "localhost";
    const res = await app.request(`${appServer}/ics?url=http://${host}`, {
      headers: {
        host,
      },
    });
    expect(res.status).toBe(400);
    const body = await res.text();
    expect(body).toContain("forbidden url");
  });

  it("should be 400 when pass bad url", async () => {
    const res = await app.request(`${appServer}/ics?url=foo`);
    expect(res.status).toBe(500);
    const body = await res.text();
    expect(body).toContain("bad url");
  });

  it("should be 404 when url is 404", async () => {
    const res = await app.request(`${appServer}/ics?url=${exampleServer}/404`);
    expect(res.status).toBe(404);
  });

  it("should be 404 when url has no date", async () => {
    const res = await app.request(
      `${appServer}/ics?url=${exampleServer}/nodate`
    );
    expect(res.status).toBe(404);
  });

  it("should be 200 when url has date", async () => {
    const res = await app.request(`${appServer}/ics?url=${exampleServer}/date`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("Generate ics");
  });
});

describe("POST /ics", () => {
  it("should be generate ics when pass Title, From and To", async () => {
    const title = "Birthday";
    const url = `${exampleServer}/date`;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("from", "2023-04-07T12:00:00.000");
    formData.append("to", "2023-04-16T12:00:00.000");
    formData.append("isMultipleDates", "1");
    formData.append("url", url);
    const req = new Request(`${appServer}/ics`, {
      method: "POST",
      body: formData,
    });
    const res = await app.request(req);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("VCALENDAR");
    expect(body).toContain(`SUMMARY:${title}`);
    expect(body).toContain(`DTSTART:20230407`);
    expect(body).toContain(`URL:${url}`);
  });

  it("should be generate ics when it is not multiple date", async () => {
    const formData = new FormData();
    formData.append("title", "Birthday");
    formData.append("from", "2023-04-07T12:00:00.000");
    formData.append("url", `${exampleServer}/date`);
    const req = new Request(`${appServer}/ics`, {
      method: "POST",
      body: formData,
    });
    const res = await app.request(req);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain(`DTSTART:20230407`);
    expect(body).toContain(`DTEND:20230407`);
  });

  it("should be 301 when from and to are same date though multiple date", async () => {
    const formData = new FormData();
    formData.append("title", "Birthday");
    formData.append("from", "2023-04-07T12:00:00.000");
    formData.append("to", "2023-04-07T12:00:00.000");
    formData.append("url", `${exampleServer}/date`);
    formData.append("isMultipleDates", "1");
    const req = new Request(`${appServer}/ics`, {
      method: "POST",
      body: formData,
    });
    const res = await app.request(req);
    expect(res.status).toBe(301);
  });

  it("should be 301 when From is after To", async () => {
    const formData = new FormData();
    formData.append("title", "Birthday");
    formData.append("from", "2023-04-10T12:00:00.000");
    formData.append("to", "2023-04-08T12:00:00.000");
    formData.append("isMultipleDates", "1");
    formData.append("url", `${exampleServer}/date`);
    const req = new Request(`${appServer}/ics`, {
      method: "POST",
      body: formData,
    });
    const res = await app.request(req);
    expect(res.status).toBe(301);
  });
});
