import { isValidPeriod } from "../date";

describe("validPeriod", () => {
  it("should be true when From is before To", () => {
    const from = "2022-11-20";
    const to = "2022-11-21";
    expect(isValidPeriod(from, to)).toEqual(true);
  });

  it("should be false when From is after To", () => {
    const from = "2022-11-20";
    const to = "2022-11-19";
    expect(isValidPeriod(from, to)).toEqual(false);
  });

  it("should be false when To is equal to From", () => {
    const from = "2022-11-20";
    const to = "2022-11-20";
    expect(isValidPeriod(from, to)).toEqual(false);
  });
});
