-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "missingFields" TEXT[],
    "futureStudy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_noteId_key" ON "Analysis"("noteId");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
