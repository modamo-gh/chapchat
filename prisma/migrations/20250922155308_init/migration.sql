-- CreateTable
CREATE TABLE "public"."books" (
    "authors" TEXT[],
    "coverURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "subtitle" TEXT,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("isbn")
);
