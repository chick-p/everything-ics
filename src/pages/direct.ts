import { html } from "hono/html";
import { Layout } from "../components/Layout";

const content = () => html`
  <section>
    <h2>Direct input</h2>
    <form method="get" action="/ics">
      <input
        type="url"
        id="url"
        name="url"
        class="c-title--input spacer"
        placeholder="URL"
        required
      />
      <div>
        <button type="submit" class="c-button">Send</button>
      </div>
    </form>
  </section>
`;

export const Direct = async (props: { appName: string }) => {
  const children = await content();
  return html` ${Layout({ title: props.appName, children })} `;
};
