# everything-ics

You can easily register the event to your calendar from a news site page.  
[イベント情報のページからカレンダーに予定を登録する「everything-ics」を作った](https://blog.chick-p.work/blog/everything-ics)（Japanese）

## Requirements

- Cloudflare Workers
- iOS Shortcut

## Deploy

```shell
pnpm install
pnpm run deploy

> everything-ics@0.0.0 deploy
> wrangler publish

 ⛅️ wrangler 2.14.0
--------------------
...
Uploaded everything-ics (2.51 sec)
Published everything-ics (0.31 sec)
  https://everything-ics.YOUR_WORKER_ID.workers.dev
...
```

Your Cloudflare Workers URL is as follows:  
`https://everything-ics.YOUR_WORKER_ID.workers.dev`

## Usage

Access to your Cloudflare Workers URL.
