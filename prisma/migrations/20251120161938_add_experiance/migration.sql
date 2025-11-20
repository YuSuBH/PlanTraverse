-- CreateTable
CREATE TABLE "public"."Experience" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExperienceImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Experience_lat_lng_idx" ON "public"."Experience"("lat", "lng");

-- CreateIndex
CREATE INDEX "Experience_userId_idx" ON "public"."Experience"("userId");

-- CreateIndex
CREATE INDEX "ExperienceImage_experienceId_idx" ON "public"."ExperienceImage"("experienceId");

-- AddForeignKey
ALTER TABLE "public"."Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExperienceImage" ADD CONSTRAINT "ExperienceImage_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
