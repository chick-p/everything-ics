import { getFirstEventDate } from "../extract";

describe("getFirstEventDate", () => {
  const currentYear = new Date().getFullYear();

  it("should return short date", () => {
    const body = "今日は4月7日です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(new Date(currentYear, 3, 7));
  });

  it("should return short date with white spaces", () => {
    const body = "今日は 4 月 7 日です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(new Date(currentYear, 3, 7));
  });

  it("should return null without date string", () => {
    const body = "今日は晴れです";
    const date = getFirstEventDate(body);
    expect(date).toEqual(null);
  });

  it("should return date with full date string", () => {
    const body = "今日は2022年12月23日です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(new Date(2022, 11, 23));
  });

  it("should return first date with multiple date strings", () => {
    const body = "今日は12月23日で明日は12月24日です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(new Date(currentYear, 11, 23));
  });

  it("should return full date with date and full date strings", () => {
    const body = "今日は12月23日で明日は2022年12月24日です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(new Date(2022, 11, 24));
  });

  it("should return date with slashed date strings", () => {
    const body = "今日は2022/12/25です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(new Date(2022, 11, 25));
  });

  it("should return null with fraction strings", () => {
    const body = "ケーキを3/4食べた";
    const date = getFirstEventDate(body);
    expect(date).toEqual(null);
  });

  it("should return null with white spaces included slashed strings", () => {
    const body = "今日は2022 / 12 / 25です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(null);
  });

  it("should return full date with slashed date and full date strings", () => {
    const body = "今日は2022/12/25で明日は2022年12月26日です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(new Date(2022, 11, 26));
  });

  it("should return short date with slashed date and short date strings", () => {
    const body = "今日は2022/12/25で明日は12月26日です";
    const date = getFirstEventDate(body);
    expect(date).toEqual(new Date(currentYear, 11, 26));
  });
});
