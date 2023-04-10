export const extractRegex = (str: string, regex: RegExp): string => {
  const matcher = str.match(regex);
  if (matcher && matcher.length !== 0) {
    return matcher[1];
  }
  return "";
};

const getEventDate = (dateString: string): Date => {
  if (!dateString.includes("年")) {
    const currentYear = new Date().getFullYear();
    dateString = `${currentYear}年${dateString}`;
  }
  const dateArray = dateString
    .split(/\s/)
    .join("")
    .replace(/日/, "")
    .split(/年|月/);
  const [yearString, monthString, dayString] = dateArray;
  const date = new Date(
    Number(yearString),
    Number(monthString) - 1,
    Number(dayString)
  );
  return date;
};

export const extractDate = (body: string) => {
  const fullDateString = extractRegex(body, /(\d+\s*年\s*\d+\s*月\s*\d+\s*日)/);
  if (fullDateString) {
    return getEventDate(fullDateString);
  }
  const dateString = extractRegex(body, /(\d+\s*月\s*\d+\s*日)/);
  if (dateString) {
    return getEventDate(dateString);
  }
  return null;
};
