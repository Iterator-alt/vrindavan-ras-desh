# Fix Image Upload - Vercel Blob Storage Setup

## Issue
Image upload is failing with "Failed to upload image. Please try again."

## Root Cause
The Vercel Blob storage might not be properly configured or the store doesn't exist.

## Solution: Create/Verify Vercel Blob Store

### Step 1: Check if Blob Store Exists

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: **jaijai**
3. Go to **Storage** tab
4. Look for a **Blob** store

### Step 2: Create Blob Store (if it doesn't exist)

1. In the **Storage** tab, click **Create Database**
2. Select **Blob**
3. Give it a name: `jaijai-images` or `product-images`
4. Click **Create**

### Step 3: Connect Blob Store to Project

1. After creating, click **Connect Project**
2. Select your **jaijai** project
3. Select all environments: **Production**, **Preview**, **Development**
4. Click **Connect**

This will automatically:
- Create the `BLOB_READ_WRITE_TOKEN` environment variable
- Configure the Blob store for your project

### Step 4: Redeploy

After connecting the Blob store:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy**

---

## Alternative: Use Direct URL Upload (Temporary Fix)

If you want to test quickly without Blob storage, I can modify the product form to accept direct image URLs instead of uploads. This way you can:
- Use images from external sources (Unsplash, your own hosting, etc.)
- Paste the URL directly
- Skip the upload step

Let me know if you'd like me to implement this temporary solution!

---

## Verification

After setting up Blob storage, try uploading again:
1. Go to `/admin/products`
2. Click "+ Add New Product"
3. Try uploading an image
4. You should see the image preview appear

---

## What I've Done

✅ Added better error handling to the upload route
✅ The error message will now be more specific
✅ Committed and pushed the fix

**Next:** Set up Vercel Blob storage following the steps above, then redeploy.
