---
title: Push notifications
description: Using the third-party service ntfy.sh, you can send push notifications to phones and computer with Val Town.
updated: 2025-09-08
---

While we have tentative plans to create `console.push` that would be as easy to
use as `console.email` and might work via
[Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API), in
the meantime we recommend [ntfy.sh](http://ntfy.sh) as an easy way to send
yourself push notifications to your phone.

## [ntfy.sh](https://ntfy.sh)

1. Download the app
2. Create an account
3. Add your channel to your
   [Val Town Environment Variables](https://val.town/settings/environment-variables)
4. Use `@axelav.sendNotification` to send yourself a message

<iframe src="https://www.val.town/embed/axelav/sendNotification" class="val-embed" loading="lazy"></iframe>

## Pushover

For iOS, [Pushover](https://pushover.net/) is another great way to get push
notifications.

[Pushover template val](https://www.val.town/x/jacobbudin/pushover/code/main.ts)
