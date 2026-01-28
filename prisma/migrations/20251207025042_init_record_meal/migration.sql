-- CreateTable
CREATE TABLE "MealRecord" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "typeOfMeal" TEXT NOT NULL,
    "qtyFrozen" INTEGER NOT NULL,
    "qtyFresh" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealRecord_pkey" PRIMARY KEY ("id")
);
