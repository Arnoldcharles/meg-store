This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Assistant (optional)

This project includes a simple AI Assistant available at `/ai`.

- To enable real AI responses from OpenAI, set the environment variable `OPENAI_API_KEY` before starting the dev server. On Windows PowerShell:

```powershell
$env:OPENAI_API_KEY = "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"
npm run dev
```

- If `OPENAI_API_KEY` is not set the assistant will return a helpful fallback message (useful for local development without a key).

The assistant uses a basic chat UI component at `src/components/AIChat.tsx` and a server API route at `src/app/api/ai/route.ts` which proxies requests to the OpenAI API when configured.
