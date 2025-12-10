# Vercel Deployment Fix - Database Migration

The deployment failed because the new database tables (Product, Category, Order, OrderItem) don't exist yet in the production database.

## Solution: Run Prisma Migration on Vercel Database

### Option 1: Use Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Link your project**:
```bash
vercel link
```

4. **Pull environment variables** (to get DATABASE_URL):
```bash
vercel env pull .env.production
```

5. **Run the migration**:
```bash
npx prisma migrate deploy
```

This will create the new tables in your Vercel Postgres database.

6. **Redeploy**:
```bash
vercel --prod
```

---

### Option 2: Manual Migration via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Postgres**
3. Click on your database
4. Go to **Query** tab
5. Run this SQL to create the tables:

```sql
-- Create Category table
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Product table
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "compareAtPrice" DOUBLE PRECISION,
    "images" TEXT[],
    "categoryId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create Order table
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL UNIQUE,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingState" TEXT NOT NULL,
    "shippingPincode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create OrderItem table
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
```

6. After running the SQL, go back to **Deployments** and click **Redeploy**

---

### Option 3: Temporary Fix - Skip Product Pages During Build

If you want to deploy quickly without the migration, we can temporarily disable the product pages:

1. Comment out the product routes in the build
2. Deploy successfully
3. Run migration
4. Uncomment and redeploy

---

## Recommended Approach

**Use Option 1** (Vercel CLI) as it's the cleanest and most reliable method. It will:
- Use the official Prisma migration system
- Create proper migration history
- Ensure database schema matches your Prisma schema exactly

Let me know which option you'd like to proceed with!
