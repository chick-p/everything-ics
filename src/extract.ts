export const extractRegex = (str: string, regex: RegExp): string => {
  const matcher = str.match(regex);
  if (matcher && matcher.length !== 0) {
    return matcher[1];
  }
  return "";
};

export const extractEventName = (body: string): string => {
  return extractRegex(body, /<title>(.*?)<\/title>/);
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

export const formattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

export const extractEventDates = (body: string) => {
  const dateMap: Record<string, Date> = {};
  const fullDateString = extractRegex(body, /(\d+\s*年\s*\d+\s*月\s*\d+\s*日)/);
  if (fullDateString) {
    const date = getEventDate(fullDateString);
    dateMap[formattedDate(date)] = date;
  }
  const dateString = extractRegex(body, /(\d+\s*月\s*\d+\s*日)/);
  if (dateString) {
    const date = getEventDate(dateString);
    dateMap[formattedDate(date)] = date;
  }
  const slashedDateString = extractRegex(body, /(\d{4}\/\d{1,2}\/\d{1,2})/);
  if (slashedDateString) {
    const date = getEventDate(slashedDateString);
    dateMap[formattedDate(date)] = date;
  }
  return Object.values(dateMap);
};

export const sortDateByAsc = (dates: Array<Date>) =>
  dates.sort((a, b) => (a > b ? 1 : -1));

export const escapeNewline = (str: string) => str.replace(/\r|\n/g, "");
