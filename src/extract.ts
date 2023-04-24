const extractRegex = (str: string, regex: RegExp): Array<string> => {
  const matchesIterator = str.matchAll(regex);
  let matchedStrings: Array<string> = [];
  for (const match of matchesIterator) {
    matchedStrings = [...matchedStrings, match[1]];
  }
  return matchedStrings;
};

export const extractEventName = (body: string): string => {
  const title = extractRegex(body, /<title>(.*?)<\/title>/g);
  return title?.[0] || "";
};

export const hasYearString = (dateString: string): boolean => {
  if (dateString.includes("年")) {
    return true;
  }
  if (/(^\d{4})\//.test(dateString)) {
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

const extractEventDatesWithRegExp = (
  body: string,
  regex: RegExp
): Record<string, Date> => {
  const dateMap: Record<string, Date> = {};
  const dateStrings = extractRegex(body, regex);
  dateStrings.forEach((dateString) => {
    const date = getEventDate(dateString);
    dateMap[formattedDate(date)] = date;
  });
  return dateMap;
};

export const extractEventDates = (body: string) => {
  let dateMap: Record<string, Date> = {};

  const fullDateRegex = /(\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日)/g;
  dateMap = { ...dateMap, ...extractEventDatesWithRegExp(body, fullDateRegex) };
  let replacedBody = body.replaceAll(fullDateRegex, "");

  const shortDateRegex = /(\d{1,2}\s*月\s*\d{1,2}\s*日)/g;
  dateMap = {
    ...dateMap,
    ...extractEventDatesWithRegExp(replacedBody, shortDateRegex),
  };
  replacedBody = replacedBody.replaceAll(shortDateRegex, "");

  const slashedDateRegex = /(\d{4}\/\d{1,2}\/\d{1,2})/g;
  dateMap = {
    ...dateMap,
    ...extractEventDatesWithRegExp(replacedBody, slashedDateRegex),
  };

  return Object.values(dateMap);
};

export const sortDateByAsc = (dates: Array<Date>) =>
  dates.sort((a, b) => (a > b ? 1 : -1));

export const escapeNewline = (str: string) => str.replace(/\r|\n/g, "");
