# Deployment Guide - Vrindavan Ras Desh

This guide will walk you through deploying your website to the internet using **Vercel** (free hosting) and **Vercel Postgres** (free cloud database).

## Prerequisites

- A GitHub account
- A Vercel account (you can sign up with GitHub)

## Step 1: Prepare Your Code

### 1.1 Update Database Configuration

Open `prisma/schema.prisma` and update the datasource to support both SQLite (local) and Postgres (production):

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

> **Note**: Change `provider = "sqlite"` to `provider = "postgresql"`

### 1.2 Add Postinstall Script

Open `package.json` and add a `postinstall` script:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "postinstall": "prisma generate"
},
```

### 1.3 Environment Variables

Create a `.env.example` file in the root with this content:

```
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)

Open PowerShell in your project folder (`C:\Users\Mohit\jaijai`) and run:

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Name it `vrindavan-ras-desh`
4. Keep it **Public** or **Private** (your choice)
5. Don't initialize with README (we already have code)
6. Click **Create repository**

### 2.3 Push Code to GitHub

Copy the commands from GitHub (they'll look like this):

```bash
git remote add origin https://github.com/YOUR-USERNAME/vrindavan-ras-desh.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Sign Up / Log In

1. Go to [Vercel](https://vercel.com)
2. Click **Sign Up** and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub

### 3.2 Import Your Project

1. From the Vercel dashboard, click **Add New...** → **Project**
2. Find your `vrindavan-ras-desh` repository
3. Click **Import**

### 3.3 Configure Build Settings

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)

Click **Deploy** (it will fail initially because we haven't set up the database yet - this is expected!)

## Step 4: Set Up Vercel Postgres

### 4.1 Create Database

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database**
3. Choose **Postgres**
4. Select the **Hobby** plan (Free)
5. Click **Create**

### 4.2 Connect to Your Project

1. After creation, go to the **Settings** tab of your database
2. Click **Connect to Project**
3. Select your `vrindavan-ras-desh` project
4. This automatically adds `DATABASE_URL` to your environment variables

### 4.3 Add Other Environment Variables

1. Go to your project → **Settings** → **Environment Variables**
2. Add these:
   - **NEXTAUTH_SECRET**: Generate a random string (you can use [this generator](https://generate-secret.vercel.app/32))
   - **NEXTAUTH_URL**: `https://your-project.vercel.app` (copy your deployment URL)

## Step 5: Initialize Database Schema

### 5.1 Install Vercel CLI (if needed)

```bash
npm i -g vercel
```

### 5.2 Link Your Project

```bash
vercel link
```

Follow the prompts to link to your existing project.

### 5.3 Pull Environment Variables

```bash
vercel env pull .env.local
```

This downloads your production environment variables locally.

### 5.4 Push Database Schema

```bash
npx prisma db push
```

This creates all your tables in the cloud database.

### 5.5 Seed the Database

Run the seed script to create your Superadmin user:

```bash
npx prisma db seed
```

## Step 6: Redeploy

1. Go back to your Vercel dashboard
2. Go to **Deployments**
3. Click **Redeploy** on the latest deployment
4. Your site should now be live! 🎉

## Step 7: Test Your Site

1. Visit your site: `https://your-project.vercel.app`
2. Go to `/login`
3. Log in with:
   - Email: `admin@vrindavan.com`
   - Password: `admin123`
4. Go to `/admin/settings` and try updating the hero image or videos
5. Go back to the home page and see the changes!

## Step 8: Configure Vercel Blob (Image Uploads)

To enable image uploads, you need to set up Vercel Blob storage:

1.  Go to your Vercel Project Dashboard.
2.  Click on the **Storage** tab.
3.  Click **Connect Store** and select **Blob**.
4.  Follow the steps to create a new Blob store.
5.  The `BLOB_READ_WRITE_TOKEN` will be automatically added to your environment variables.
6.  **Redeploy** your application for the changes to take effect.

## Future Updates

Whenever you make changes to your code:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
2. Vercel will automatically redeploy! ✨

## Troubleshooting

### Error: "Prisma Client did not initialize"
- Run `npx prisma generate` locally
- Make sure `postinstall` script is in `package.json`

### Error: "Database connection failed"
- Check that `DATABASE_URL` is set in Vercel Environment Variables
- Verify your Postgres database is connected to the project

### Updates Not Showing
- Clear your browser cache
- Wait a few seconds for Vercel's CDN to update
