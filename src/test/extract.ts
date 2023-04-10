import { extractDate } from "../extract";

describe("extractDate", () => {
  const currentYear = new Date().getFullYear();

  it("should return date", () => {
    const body = "今日は4月7日です";
    const date = extractDate(body);
    expect(date).toEqual(new Date(currentYear, 3, 7));
  });

  it("should return date with white spaces", () => {
    const body = "今日は 4 月 7 日です";
    const date = extractDate(body);
    expect(date).toEqual(new Date(currentYear, 3, 7));
  });
});
