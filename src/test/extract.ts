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

  it("should return null without date string", () => {
    const body = "今日は晴れです";
    const date = extractDate(body);
    expect(date).toEqual(null);
  });

  it("should return date with full date string", () => {
    const body = "今日は2022年12月23日です";
    const date = extractDate(body);
    expect(date).toEqual(new Date(2022, 11, 23));
  });

  it("should return first date with multiple date strings", () => {
    const body = "今日は12月23日で明日は12月24日です";
    const date = extractDate(body);
    expect(date).toEqual(new Date(currentYear, 11, 23));
  });

  it("should return full date with date and full date strings", () => {
    const body = "今日は12月23日で明日は2022年12月24日です";
    const date = extractDate(body);
    expect(date).toEqual(new Date(2022, 11, 24));
  });
});
