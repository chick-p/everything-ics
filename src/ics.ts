type ICSEvent = {
  title: string;
  date: Date;
  url: string;
};
const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

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

export const generateIcs = (event: ICSEvent) => {
  const currentDate = new Date();
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//everything-ics//everything-ics//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART;TZID=UTC;VALUE=DATE-TIME:${getStandardDate(event.date)}
DTEND;TZID=UTC;VALUE=DATE-TIME:${getStandardDate(event.date)}
DTSTAMP;VALUE=DATE-TIME:${getStandardDate(currentDate)}
CATEGORIES:
CREATED;VALUE=DATE-TIME:${getStandardDate(currentDate)}
DESCRIPTION:
URL:${event.url}
END:VEVENT
END:VCALENDAR`;
};
