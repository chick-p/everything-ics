import { html } from "hono/html";
import { Layout } from "../components/Layout";

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

const dateList = (props: { date: Date }) => {
  const { date } = props;
  return html` <option value="${date.toISOString()}">
    ${formattedDate(date)}
  </option>`;
};

const content = ({ title, candidateDates, url }: Event) => html`
  <main>
    <form action="/ics" method="POST">
      <div>
        <label for="title">Title</label>
        <input
          name="title"
          id="title"
          type="text"
          value="${title}"
          placeholder="title"
        />
      </div>
      <div>
        <label for="date">Date</label>
        <select name="date" id="date">
          ${candidateDates.map((date) => dateList({ date }))}
        </select>
      </div>
      <input name="url" type="hidden" value="${url}" />
      <div>
        <button type="submit">Generate ics</button>
      </div>
    </form>
  </main>
`;

export const Edit = (props: { event: Event; appName: string }) => {
  const children = content(props.event);
  return html` ${Layout({ title: props.appName, children })} `;
};
