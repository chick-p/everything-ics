export const extractRegex = (str: string, regex: RegExp): string => {
  const matcher = str.match(regex);
  if (matcher && matcher.length !== 0) {
    return matcher[1];
  }
  return "";
};

const hasYearString = (dateString: string): boolean => {
  if (dateString.includes("年")) {
    return true;
  }
  if (extractRegex(dateString, /(^\d{4})\//)) {
    return true;
  }
  return false;
};

const getEventDate = (dateString: string): Date => {
  let fullDateString = dateString;
  if (!hasYearString(dateString)) {
    const currentYear = new Date().getFullYear();
    fullDateString = `${currentYear}年${dateString}`;
  }
  const dateArray = fullDateString
    .split(/\s/)
    .join("")
    .replace(/日/, "")
    .split(/年|月|\//);
  const [yearString, monthString, dayString] = dateArray;
  const date = new Date(
    Number(yearString),
    Number(monthString) - 1,
    Number(dayString)
  );
  return date;
};

export const extractDates = (body: string) => {
  let dates: Array<Date> = [];
  const fullDateString = extractRegex(body, /(\d+\s*年\s*\d+\s*月\s*\d+\s*日)/);
  if (fullDateString) {
    dates = dates.concat(getEventDate(fullDateString));
  }
  const dateString = extractRegex(body, /(\d+\s*月\s*\d+\s*日)/);
  if (dateString) {
    dates = dates.concat(getEventDate(dateString));
  }
  const slashedDateString = extractRegex(body, /(\d{4}\/\d{1,2}\/\d{1,2})/);
  if (slashedDateString) {
    dates = dates.concat(getEventDate(slashedDateString));
  }
  return dates;
};

export const getFirstEventDate = (body: string) => {
  const eventDates = extractDates(body);
  return eventDates?.[0] || null;
};
