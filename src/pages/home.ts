import { html } from "hono/html";
import { Layout } from "../components/Layout";

const content = (props: { host: string; appName: string }) => html`
  <main>
    <h2>How to setup shortcut</h2>
    <ol>
      <li>
        Copy your Cloudflare Worker URL:
        <br />
        <code>https://${props.host}</code>
      </li>
      <li>
        Download
        <a
          href="https://www.icloud.com/shortcuts/89d7146ce6be463eb2f4a039eed37a8a"
          >iOS Shortcut</a
        >
        and add it to your iPhone.
      </li>
      <li>Set your Cloudflare Worker URL.</li>
    </ol>
    <h2>How to use</h2>
    <ol>
      <li>Open an event page on your browser.</li>
      <li>
        Open Share Sheet and tap "${props.appName}".
        <br />
        In the first time, accept to access your Cloudflare Worker URL.
      </li>
      <li>Add an event to your calendar.</li>
    </ol>
  </main>
`;

export const Home = (props: { appName: string; host: string }) => {
  const children = content(props);
  return html` ${Layout({ title: props.appName, children })} `;
};
