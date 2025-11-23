"use server";

import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateExperience(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  const experienceId = formData.get("experienceId")?.toString();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const locationName = formData.get("locationName")?.toString();
  const latStr = formData.get("lat")?.toString();
  const lngStr = formData.get("lng")?.toString();
  const address = formData.get("address")?.toString();
  const imagesStr = formData.get("images")?.toString();

  if (
    !experienceId ||
    !title ||
    !description ||
    !locationName ||
    !latStr ||
    !lngStr
  ) {
    throw new Error("All required fields must be filled.");
  }

  // Verify ownership
  const existingExperience = await prisma.experience.findUnique({
    where: { id: experienceId },
    select: { userId: true },
  });

  if (!existingExperience) {
    throw new Error("Experience not found");
  }

  if (existingExperience.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid coordinates.");
  }

  let images: Array<{ url: string; key: string }> = [];
  if (imagesStr) {
    try {
      images = JSON.parse(imagesStr);
    } catch (error) {
      console.error("Failed to parse images:", error);
    }
  }

  // Delete existing images and create new ones
  await prisma.experienceImage.deleteMany({
    where: { experienceId },
  });

  await prisma.experience.update({
    where: { id: experienceId },
    data: {
      title,
      description,
      locationName,
      lat,
      lng,
      address,
      images: {
        create: images.map((img) => ({
          url: img.url,
          key: img.key,
        })),
      },
    },
  });

  revalidatePath("/experiences/my");
  revalidatePath("/experiences");
  revalidatePath(`/experiences/${experienceId}`);

  redirect("/experiences/my");
}
