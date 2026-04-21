# 🚀 Deployment Guide - TaskFlow

Follow these steps to deploy your full-stack application to **Render** (Backend) and **Vercel** (Frontend).

## 1. Push Code to GitHub
I have already prepared and committed the code locally. Run this command in your terminal to push it to your repository:
```bash
git push -u origin master
```

---

## 2. Backend Deployment (Render.com)
1. Log in to [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository (`TaskFlow`).
4. **Configuration:**
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. **Environment Variables (Advanced > Add Environment Variable):**
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `SUPABASE_URL`: (Your Supabase URL)
   - `SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
   - `SUPABASE_SERVICE_ROLE_KEY`: (Your Supabase Service Role Key)
   - `JWT_SECRET`: (Your Secret Key)
6. **Click Deploy.** Copy the URL once it's live (e.g., `https://taskflow-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel.com)
1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository (`TaskFlow`).
4. **Configuration:**
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
5. **Environment Variables:**
   - `VITE_API_URL`: `https://your-render-url.onrender.com/api` (Paste your Render URL here)
6. **Click Deploy.**

---

## 🔗 Connection Checklist
- [ ] Render Backend is live.
- [ ] Vercel Frontend is live.
- [ ] `VITE_API_URL` on Vercel points to the Render URL with `/api` at the end.
- [ ] Supabase table `tasks` is created via the SQL script provided earlier.

**Your app should now be fully live!**
