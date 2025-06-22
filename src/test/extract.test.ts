import { describe, it, expect } from "vitest";

import {
  escapeNewline,
  extractEventDates,
  extractEventName,
  hasYearString,
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

describe("hasYearString", () => {
  it("should be true with full date string", () => {
    const dateString = "2021年12月25日";
    expect(hasYearString(dateString)).toEqual(true);
  });

  it("should be false with month and day string", () => {
    const dateString = "12月25日";
    expect(hasYearString(dateString)).toEqual(false);
  });

  it("should be true with shash month and day string", () => {
    const dateString = "12/25";
    expect(hasYearString(dateString)).toEqual(false);
  });

  it("should be true with shash date string", () => {
    const dateString = "2021/12/25";
    expect(hasYearString(dateString)).toEqual(true);
  });
});

describe("extractEventDates", () => {
  const currentYear = new Date().getFullYear();

  it("should return short date", () => {
    const body = "今日は4月7日です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(currentYear, 3, 7));
  });

  it("should return short date with white spaces", () => {
    const body = "今日は 4 月 7 日です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(currentYear, 3, 7));
  });

  it("should be 0 length without date string", () => {
    const body = "今日は晴れです";
    const dates = extractEventDates(body);
    expect(dates.length).toEqual(0);
  });

  it("should return date with full date string", () => {
    const body = "今日は2022年12月23日です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(2022, 11, 23));
  });

  it("should return dates in order with multiple date strings", () => {
    const body = "今日は12月23日で明日は12月24日です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(currentYear, 11, 23));
    expect(dates[1]).toEqual(new Date(currentYear, 11, 24));
  });

  it("should return full date at first with date and full date strings", () => {
    const body = "今日は12月23日で明日は2022年12月24日です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(2022, 11, 24));
    expect(dates[1]).toEqual(new Date(currentYear, 11, 23));
  });

  it("should return date with slashed date strings", () => {
    const body = "今日は2022/12/25です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(2022, 11, 25));
  });

  it("should be 0 length null with fraction strings", () => {
    const body = "ケーキを3/4食べた";
    const dates = extractEventDates(body);
    expect(dates.length).toEqual(0);
  });

  it("should return 0 length with white spaces included slashed strings", () => {
    const body = "今日は2022 / 12 / 25です";
    const dates = extractEventDates(body);
    expect(dates.length).toEqual(0);
  });

  it("should return full date at first with slashed date and full date strings", () => {
    const body = "今日は2022/12/25で明日は2022年12月26日です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(2022, 11, 26));
    expect(dates[1]).toEqual(new Date(2022, 11, 25));
  });

  it("should return short date at first with slashed date and short date strings", () => {
    const body = "今日は2022/12/25で明日は12月26日です";
    const dates = extractEventDates(body);
    expect(dates[0]).toEqual(new Date(currentYear, 11, 26));
    expect(dates[1]).toEqual(new Date(2022, 11, 25));
  });

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
    expect(dates[0]).toEqual(new Date(currentYear, 11, 25));
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

describe("escapeNewline", () => {
  it("should return escaped string when with LF", () => {
    const url = "https://example.com\n";
    const escapedUrl = escapeNewline(url);
    expect(escapedUrl).toEqual("https://example.com");
  });

  it("should return escaped string when with CR", () => {
    const url = "https://example.com\r";
    const escapedUrl = escapeNewline(url);
    expect(escapedUrl).toEqual("https://example.com");
  });

  it("should return escaped string when with CR+LF", () => {
    const url = "https://example.com\r\n";
    const escapedUrl = escapeNewline(url);
    expect(escapedUrl).toEqual("https://example.com");
  });
});
