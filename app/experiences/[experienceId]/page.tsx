import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Calendar, User } from "lucide-react";

interface ExperienceDetailPageProps {
  params: {
    experienceId: string;
  };
}

export default async function ExperienceDetailPage({
  params,
}: ExperienceDetailPageProps) {
  const experience = await prisma.experience.findUnique({
    where: {
      id: params.experienceId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      images: true,
    },
  });

  if (!experience) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/experiences">
        <Button variant="outline" className="mb-4">
          ← Back to Experiences
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{experience.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{experience.user.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(experience.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{experience.locationName}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Images Gallery */}
          {experience.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experience.images.map((image, idx) => (
                <div key={image.id} className="relative w-full">
                  <Image
                    src={image.url}
                    alt={`${experience.title} - Image ${idx + 1}`}
                    className="rounded-lg object-cover w-full h-64"
                    width={600}
                    height={400}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              About this experience
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {experience.description}
            </p>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p className="text-foreground mb-2">{experience.locationName}</p>
            {experience.address && (
              <p className="text-sm text-muted-foreground mb-2">
                {experience.address}
              </p>
            )}
            <p className="text-sm text-muted-foreground/80">
              Coordinates: {experience.lat.toFixed(6)},{" "}
              {experience.lng.toFixed(6)}
            </p>

            {/* Embedded Map */}
            <div className="mt-4 w-full h-64 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${experience.lat},${experience.lng}&zoom=15`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
