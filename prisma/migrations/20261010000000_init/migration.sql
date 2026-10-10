-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FARMER', 'BUSINESS');
CREATE TYPE "ProductCategory" AS ENUM ('vegetables', 'fruits', 'dairy', 'meat', 'grains', 'mushrooms', 'other');
CREATE TYPE "Unit" AS ENUM ('KG', 'TON', 'PIECE', 'LITER');
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'SOLD_OUT', 'HIDDEN');
CREATE TYPE "InquiryStatus" AS ENUM ('OPEN', 'ACCEPTED', 'DECLINED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "phone" TEXT NOT NULL, "pinHash" TEXT NOT NULL,
  "role" "Role" NOT NULL, "city" TEXT NOT NULL, "businessName" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "LoginAttempt" (
  "id" TEXT NOT NULL, "phone" TEXT NOT NULL, "ipHash" TEXT NOT NULL, "failures" INTEGER NOT NULL DEFAULT 0, "lockedUntil" TIMESTAMP(3), "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT,
  CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Product" (
  "id" TEXT NOT NULL, "farmerId" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT NOT NULL, "category" "ProductCategory" NOT NULL,
  "unit" "Unit" NOT NULL, "quantityAvailable" DECIMAL(12,2) NOT NULL, "pricePerUnit" DECIMAL(12,2) NOT NULL, "minOrderQuantity" DECIMAL(12,2),
  "city" TEXT NOT NULL, "harvestDate" DATE NOT NULL, "imageUrls" TEXT[], "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Inquiry" (
  "id" TEXT NOT NULL, "productId" TEXT NOT NULL, "businessId" TEXT NOT NULL, "quantity" DECIMAL(12,2) NOT NULL,
  "message" TEXT, "status" "InquiryStatus" NOT NULL DEFAULT 'OPEN', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE UNIQUE INDEX "LoginAttempt_phone_ipHash_key" ON "LoginAttempt"("phone", "ipHash");
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");
CREATE INDEX "LoginAttempt_lockedUntil_idx" ON "LoginAttempt"("lockedUntil");
CREATE INDEX "Product_status_createdAt_idx" ON "Product"("status", "createdAt");
CREATE INDEX "Product_city_status_createdAt_idx" ON "Product"("city", "status", "createdAt");
CREATE INDEX "Product_category_status_createdAt_idx" ON "Product"("category", "status", "createdAt");
CREATE INDEX "Product_farmerId_createdAt_idx" ON "Product"("farmerId", "createdAt");
CREATE INDEX "Inquiry_businessId_createdAt_idx" ON "Inquiry"("businessId", "createdAt");
CREATE INDEX "Inquiry_productId_createdAt_idx" ON "Inquiry"("productId", "createdAt");
CREATE INDEX "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt");
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
