---
title: Store data in Airtable
description: You can use Airtable with Val Town to store data or load edited
  data from other sources
updated: 2023-12-22
---

Airtable is a spreadsheet-database hybrid. Note that because
[Val Town](https://val.town) uses Deno, we use an unofficial library to access
Airtable.

## Setup

On the homepage, click Start from scratch to create a base:

![untitled.png](/images/guides-airtable-fd61ade1.webp)

If prompted with automatic setup, click Skip. You should get a new base with a
blank table.

![untitled-1.png](/images/guides-airtable-75ce0388.webp)

Adjust the table fields as you want (note that this isn't covered by this
guide).

Click on your profile icon, then on Developer hub:

![untitled-2.png](/images/guides-airtable-c3fa27d8.webp)

Click Create new token.

![untitled-3.png](/images/guides-airtable-26217e71.webp)

Fill out the fields:

- Name: Any. For example, `valtown`.
- Scopes: You'll most likely want to add `data.records:read` and
  `data.records:write`.
- Access: Add the base you created earlier.

Lastly, click Create token. Here's an example of how your settings could
probably look like:

![untitled-4.png](/images/guides-airtable-f6a74e8e.webp)

Copy your token and click Done.

![untitled-5.png](/images/guides-airtable-a9d66959.webp)

Go to [val.town](https://val.town), click on your username and then on **Env
Variables**:

![env-variables-menu.png](/images/guides-airtable-90ace021.webp)

Click **New env variable**. Set the key to a name you want to use to reference
the token (for example, `airtable_pat`) and paste the copied personal access
token into the value, then click **Add**.

![env-variables-new.png](/images/guides-airtable-cebf970d.webp)

You can then use Airtable from [val.town](https://val.town) like so:

```ts
import { Airtable } from "https://deno.land/x/airtable@v1.1.1/mod.ts";

const airtable = new Airtable({
  apiKey: Deno.env.get("airtable_pat"),
  baseId: "appXSrKDlwbAijRmD",
  tableName: "All content",
});
// Sample data from: https://blog.airtable.com/database-vs-spreadsheet/
const results = await airtable.select();
console.log(results);
```

Make sure to change:

- apiKey if you have used a different name for your environment variable.
- baseId to the ID of your base. You can find it in the URL bar while a table is
  open and it will likely start with `app`:

![untitled-8.png](/images/guides-airtable-7a1dd8f7.webp)

- tableName to either the name of your table or the table ID which can also be
  found in the URL after the base ID (see above).