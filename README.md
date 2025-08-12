# MIE Bridge (Render)

A tiny Node.js + Express bridge that forwards Alexa skill queries to MIE (OpenAI) and returns a voice‑friendly response.

## Quick Deploy on Render

1. Create a new GitHub repo and upload these three files: `package.json`, `server.js`, `README.md`.
2. Go to https://render.com → **New +** → **Web Service** → Connect your repo.
3. Settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `OPENAI_API_KEY` = `sk-...`
   - `MIE_BRIDGE_SECRET` = any random string (recommended)
   - (optional) `MIE_MODEL` = `gpt-4o-mini` (or your preferred model)
5. Click **Create Web Service** and wait for deploy.
6. Copy the public URL, e.g. `https://mie-bridge.onrender.com`

## Alexa Handler

Point your Alexa skill to POST `https://YOUR-RENDER-URL/api/mie` with header `x-mie-secret: <your secret>`.
