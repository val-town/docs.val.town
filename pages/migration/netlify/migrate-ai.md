---
title: "Migrate AI"
description: "Val Town migration guide: Migrate AI"
updated: 2026-11-07
---

Use this as a reference, not a required sequence. Adapt the approach and code to suit the app and the user’s needs.

## Choose the provider

Val Town’s managed `std/openai` access and credits do not move with the code. Keep the current model/provider first when possible; changing models can change behavior.

Use [Netlify AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/) or call the provider directly. Gateway requires an eligible credit-based plan and at least one production deployment. Confirm billing, supported models, and access before relying on it.

## Replace the helper

Install `openai` and save a Function such as `netlify/functions/generate.ts`:

```ts
import OpenAI from "openai";
import { timingSafeEqual } from "node:crypto";

export default async (request: Request) => {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  const expected = Buffer.from("Bearer " + (process.env.AI_TEST_TOKEN ?? ""));
  const supplied = Buffer.from(request.headers.get("Authorization") ?? "");
  if (!process.env.AI_TEST_TOKEN || expected.length !== supplied.length ||
      !timingSafeEqual(expected, supplied)) return new Response(null, { status: 401 });
  if (!process.env.AI_MODEL) return new Response("Model not configured", { status: 503 });
  const client = new OpenAI();
  const result = await client.responses.create({
    model: process.env.AI_MODEL!,
    input: "Reply with the word ready.",
  });
  return Response.json({ text: result.output_text });
};
```

The [gateway quickstart](https://docs.netlify.com/build/ai-gateway/quickstart-for-ai-gateway/) uses SDK-default env vars injected by Netlify. Verify `OPENAI_BASE_URL` resolves to the gateway. For direct OpenAI access, configure your own `OPENAI_API_KEY` and do not leave an unintended gateway base URL. Set `AI_MODEL` to a supported model.

Set a random `AI_TEST_TOKEN` and pass it as a bearer header from the local tester; never in a URL. The fixed prompt above is a protected connection test. Preserve the app’s actual prompts, streaming, tools, structured output, media inputs, and error handling when moving its logic. Test in an isolated deployment; add the real auth check before offering user-driven requests.

## Verify behavior and cost

Make one small test call within the budget, then inspect the response and usage for the intended account. Test streaming/cancellation if used, tool arguments, output parsing, and provider errors.

Review prompt logging and caching before sending private data. Keep keys server-side and preserve per-user limits. Remove the test Function after integration; a public endpoint must not expose unrestricted spending.
