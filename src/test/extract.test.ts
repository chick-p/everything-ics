import {
  extractEventDates,
  extractEventName,
  getFirstEventDate,
  sortDateByAsc,
} from "../extract";

describe("extractEventName", () => {
  it("should return event name", () => {
    const body = "<title>イベント名</title>";
    const eventName = extractEventName(body);
    expect(eventName).toEqual("イベント名");
  });

  it("should return empty string when title is not set", () => {
    const body = "<title></title>";
    const eventName = extractEventName(body);
    expect(eventName).toEqual("");
  });

  it("should return empty string when title is not found", () => {
    const body = "<h1>イベント名</h1>";
    const eventName = extractEventName(body);
    expect(eventName).toEqual("");
  });
});

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

describe("extractEventDates", () => {
  const currentYear = new Date().getFullYear();

  it("should return in order japanase full date, short date and slashed date", () => {
    const body =
      "今日は2022/12/25で明日は12月26日です、来年の同日は2023年12月25日です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(2023, 11, 25));
    expect(dates[1]).toEqual(new Date(currentYear, 11, 26));
    expect(dates[2]).toEqual(new Date(2022, 11, 25));
  });

  it("should return no duplicated dates", () => {
    const body = "今日は12/25で、クリスマスは12月25日です";
    const dates = extractEventDates(body);
    expect(dates.length).toEqual(1);
  });
});

describe("sortDateByAsc", () => {
  it("should return sorted dates by asc", () => {
    const dates = [
      new Date(2022, 11, 27),
      new Date(2022, 11, 25),
      new Date(2022, 11, 26),
    ];
    const sortedDates = sortDateByAsc(dates);
    expect(sortedDates[0]).toEqual(new Date(2022, 11, 25));
    expect(sortedDates[1]).toEqual(new Date(2022, 11, 26));
    expect(sortedDates[2]).toEqual(new Date(2022, 11, 27));
  });
});
