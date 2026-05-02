# Local Notification Architecture

## Overview
We needed a way to queue and send notifications (Emails, SMS) without blocking the main API thread. Since we can't use RabbitMQ or Redis for this specific local evaluation track, I built a simulated async worker directly into the Node.js event loop.

## How it works
1. **API Layer**: Express receives `POST /api/notify/email`.
2. **Immediate Return**: The controller writes a `PENDING` record to `data/notifications.json` and immediately returns `202 Accepted` to the client. Fast response times.
3. **Async Worker**: We kick off `_processAsync()` but we **don't** `await` it. This acts as our background worker.
4. **Retry Logic**: The worker sleeps for 500ms to simulate network delay. If the "third-party API" fails (simulated with a random 30% failure rate), it retries up to 3 times with exponential backoff (1s, 2s, 3s).
5. **Dead Letter Queue**: If it fails all 3 times, the status is updated to `FAILED` in the JSON file.

## Why this approach?
- Keeps the API extremely fast (`<20ms` response times) even if the third-party email provider takes 3 seconds to respond.
- Completely avoids external dependencies.
- It's "Queue-Ready". If we ever want to scale this, we just swap `_processAsync()` with `bullmq.add()` and it works instantly across distributed servers.

## Potential Issues
- Node is single-threaded. If the server crashes mid-process, any "PENDING" notifications won't automatically resume on reboot since we don't have a startup cron job polling for stale records yet.
- JSON file writes aren't atomic, so high throughput might cause data race conditions. Good enough for local demo, needs SQLite or Postgres for real prod.
