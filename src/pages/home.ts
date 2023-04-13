import { html } from "hono/html";
import { Layout } from "../components/Layout";

const content = (props: { host: string; appName: string }) => html`
  <section>
    <h2>How to setup shortcut</h2>
    <ol>
      <li>
        Copy your Cloudflare Workers URL:
        <br />
        <code>https://${props.host}</code>
      </li>
      <li>
        Download
        <a
          href="https://www.icloud.com/shortcuts/607d5d4edde1496993eb0d839544aca2"
          >iOS Shortcut</a
        >
        and add it to your iPhone.
      </li>
      <li>Set your Cloudflare Workers URL.</li>
    </ol>
    <h2>How to use</h2>
    <ol>
      <li>Open an event page on your browser.</li>
      <li>
        Open Share Sheet and tap "${props.appName}".
        <br />
        In the first time, accept to access your Cloudflare Workers URL.
      </li>
      <li>Add an event to your calendar.</li>
    </ol>
  </section>
`;

export const Home = (props: { appName: string; host: string }) => {
  const children = content(props);
  return html` ${Layout({ title: props.appName, children })} `;
};
