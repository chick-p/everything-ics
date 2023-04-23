const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const getDateOnly = (date: Date): string => {
  return [
    date.getFullYear(),
    padZero(date.getMonth() + 1),
    padZero(date.getDate()),
  ].join("");
};

const getStandardDate = (date: Date): string => {
  return [
    date.getFullYear(),
    padZero(date.getMonth() + 1),
    padZero(date.getDate()),
    "T",
    padZero(date.getHours()),
    padZero(date.getMinutes()),
    padZero(date.getSeconds()),
  ].join("");
};

export const generateIcs = ({
  title,
  from,
  to,
  url,
}: Record<"title" | "from" | "to" | "url", string>) => {
  const currentDate = new Date();
  const eventDateFrom = new Date(from);
  const eventDateTo = new Date(to);
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//everything-ics//everything-ics//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${getDateOnly(eventDateFrom)}
DTEND:${getDateOnly(eventDateTo)}
DTSTAMP;VALUE=DATE-TIME:${getStandardDate(currentDate)}
CATEGORIES:
CREATED;VALUE=DATE-TIME:${getStandardDate(currentDate)}
DESCRIPTION:
URL:${url}
END:VEVENT
END:VCALENDAR`;
};
