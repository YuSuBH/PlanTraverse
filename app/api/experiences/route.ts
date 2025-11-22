import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(experiences);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const body = await req.json();
    const { title, description, locationName, lat, lng, address, images } =
      body;

    if (
      !title ||
      !description ||
      !locationName ||
      lat === undefined ||
      lng === undefined
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: {
        title,
        description,
        locationName,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address,
        userId: session.user.id,
        images: images
          ? {
              create: images.map((img: { url: string; key: string }) => ({
                url: img.url,
                key: img.key,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(experience);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
