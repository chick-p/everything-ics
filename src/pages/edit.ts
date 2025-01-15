import { html } from "hono/html";
import { Layout } from "../components/Layout";
import { formattedDate, sortDateByAsc } from "../extract";
import { getBeginingOfDay } from "../date";

type Event = {
  title: string;
  candidateDates: Array<Date>;
  url: string;
};

const dateList = (props: { date: Date; highPriorityDate: Date }) => {
  const { date, highPriorityDate } = props;
  return html` <option
    value="${date.toISOString()}"
    ${date === highPriorityDate ? "selected" : ""}
    class="c-date--option"
  >
    ${formattedDate(date)}
  </option>`;
};

const getHighPriorityDate = (dates: Array<Date>): Date => {
  const today = getBeginingOfDay(new Date());
  const futureDates = dates.filter((date) => date >= today);
  return futureDates[0] || dates[0];
};

const buildDateSection = (dates: Array<Date>, highPriorityDate: Date) => {
  const hasMultiCandidates = dates.length > 1;

  return html`<div>
      <div class="hidden">
        <select id="all-datelist">
          ${dates.map((date) => dateList({ date, highPriorityDate }))}
        </select>
      </div>
      <div class="c-date-from">
        <label for="date-from" class="c-date-from--label">Date</label>
        <select name="from" id="date-from" class="c-date--select spacer">
          ${dates.map((date) => dateList({ date, highPriorityDate }))}
        </select>
      </div>
      <div class="c-date-to hidden">
        <label for="date-to" class="c-date-to--label">To</label>
        <select name="to" id="date-to" class="c-date--select spacer">
          ${dates.map((date) => dateList({ date, highPriorityDate }))}
        </select>
      </div>
    </div>
    <div class="${hasMultiCandidates ? `` : `hidden`}">
      <div class="c-multiple-dates">
        <label class="c-multiple-dates--toggle">
          <input
            type="checkbox"
            id="multiple-dates"
            name="isMultipleDates"
            value="1"
          />
        </label>
        <label for="multiple-dates" class="c-multiple-dates--label"
          >Multiple date</label
        >
      </div>
      <div class="c-all-dates">
        <label class="c-all-dates--toggle">
          <input type="checkbox" id="all-dates" value="1" />
        </label>
        <label for="all-dates" class="c-all-dates--label">Show all dates</label>
      </div>
    </div>`;
};
const buildErrorMessage = (error: string) =>
  html`<div class="c-message c-message--error" role="alert">
    <span>${error}</span>
  </div>`;

const content = ({ title, candidateDates, url }: Event, error: string) => {
  const highPriorityDate = getHighPriorityDate(candidateDates);
  const sortDates = sortDateByAsc(candidateDates);
  return html`
    <section>
      ${error ? buildErrorMessage(error) : ""}
      <form action="/ics" method="POST">
        <div>
          <label for="title" class="c-title--label">Title</label>
          <input
            name="title"
            id="title"
            type="text"
            value="${title}"
            placeholder="title"
            class="c-title--input spacer"
          />
        </div>
        <div>${buildDateSection(sortDates, highPriorityDate)}</div>
        <input name="url" type="hidden" value="${url}" />
        <div>
          <button type="submit" class="c-button">Generate ics</button>
        </div>
      </form>
    </section>
  `;
};

export const Edit = async (
  props: { event: Event; appName: string },
  error: string,
) => {
  const children = await content(props.event, error);
  return html` ${Layout({ title: props.appName, children })} `;
};
