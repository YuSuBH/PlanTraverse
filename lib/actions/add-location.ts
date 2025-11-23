"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated.");
  }

  const locationName = formData.get("locationName")?.toString();
  const latStr = formData.get("lat")?.toString();
  const lngStr = formData.get("lng")?.toString();

  if (!locationName || !latStr || !lngStr) {
    throw new Error("Missing required location data.");
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid coordinates.");
  }

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: locationName,
      lat,
      lng,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`);
}
