import { html } from "hono/html";
import { Layout } from "../components/Layout";
import { sortDateByAsc } from "../extract";

type Event = {
  title: string;
  candidateDates: Array<Date>;
  url: string;
};

const formattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

const dateList = (props: { date: Date; highPriorityDate: Date }) => {
  const { date, highPriorityDate } = props;
  return html` <option
    value="${date.toISOString()}"
    ${date === highPriorityDate ? "selected" : ""}
  >
    ${formattedDate(date)}
  </option>`;
};

const content = ({ title, candidateDates, url }: Event) => {
  const highPriorityDate = candidateDates[0];
  const sortDates = sortDateByAsc(candidateDates);
  return html`
    <section>
      <form action="/ics" method="POST">
        <div>
          <label for="title">Title</label>
          <input
            name="title"
            id="title"
            type="text"
            value="${title}"
            placeholder="title"
            class="c-input"
          />
        </div>
        <div>
          <label for="date">Date</label>
          <select name="date" id="date" class="c-input">
            ${sortDates.map((date) => dateList({ date, highPriorityDate }))}
          </select>
        </div>
        <input name="url" type="hidden" value="${url}" />
        <div>
          <button type="submit" class="c-button">Generate ics</button>
        </div>
      </form>
    </section>
  `;
};

export const Edit = (props: { event: Event; appName: string }) => {
  const children = content(props.event);
  return html` ${Layout({ title: props.appName, children })} `;
};
