"use server";

import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import { auth } from "@/auth";

export async function createExperience(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const locationName = formData.get("locationName")?.toString();
  const latStr = formData.get("lat")?.toString();
  const lngStr = formData.get("lng")?.toString();
  const address = formData.get("address")?.toString();
  const imagesStr = formData.get("images")?.toString();

  if (!title || !description || !locationName || !latStr || !lngStr) {
    throw new Error("All required fields must be filled.");
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

  const experience = await prisma.experience.create({
    data: {
      title,
      description,
      locationName,
      lat,
      lng,
      address,
      userId: session.user.id,
      images: {
        create: images.map((img) => ({
          url: img.url,
          key: img.key,
        })),
      },
    },
  });

  redirect(`/experiences/${experience.id}`);
}
