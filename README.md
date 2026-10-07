<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌴 LeaveEase - Employee Leave Management System

A modern, full-stack Employee Leave Management System built with React, TypeScript, Express, and Google Gemini AI.

## 🚀 Deployment on Render

If you are deploying on **Render**:

### Service Settings (Web Service):
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Port**: Render automatically provides `PORT` env variable.

> **Why was it not showing before?**
> Standard Node (`node server.ts`) cannot run TypeScript `.ts` files directly. We configured the build pipeline to compile `server.ts` into a production-ready `server.js` using `esbuild` during `npm run build`.

---

## 💻 Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env` (optional, for AI leave classification)
3. Run the app:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:3000` and the about page at `about.html`.

