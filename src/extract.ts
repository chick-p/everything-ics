export const extractRegex = (str: string, regex: RegExp): string => {
  const matcher = str.match(regex);
  if (matcher && matcher.length !== 0) {
    return matcher[1];
  }
  return "";
};

const getEventDate = (dateString: string): Date => {
  const dateArray = dateString.split(/\s/).join().replace(/日/, "").split(/月/);
  const [monthString, dayString] = dateArray;
  const date = new Date();
  date.setMonth(parseInt(monthString, 10) - 1);
  date.setDate(parseInt(dayString, 10));
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

export const extractDate = (body: string) => {
  const dateString = extractRegex(body, /(\d+\s*月\s*\d+\s*日)/);
  return getEventDate(dateString);
};
