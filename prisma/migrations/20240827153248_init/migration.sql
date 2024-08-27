-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "Customer" (
    "id" UUID NOT NULL,
    "customer_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measure" (
    "id" UUID NOT NULL,
    "measure_uuid" TEXT NOT NULL,
    "customerId" UUID NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "measure_value" INTEGER,
    "image_url" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_code_key" ON "Customer"("customer_code");

-- CreateIndex
CREATE UNIQUE INDEX "Measure_measure_uuid_key" ON "Measure"("measure_uuid");

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
