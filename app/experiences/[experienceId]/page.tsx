import { prisma } from "@/lib/prisma";
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
      <Link href="/experiences">
        <Button
          variant="ghost"
          className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
        >
          ← Back to Experiences
        </Button>
      </Link>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {experience.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">
                {experience.user.name || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(experience.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{experience.locationName}</span>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        {experience.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experience.images.map((image, idx) => (
              <div
                key={image.id}
                className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm"
              >
                <Image
                  src={image.url}
                  alt={`${experience.title} - Image ${idx + 1}`}
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  fill
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-12">
          {/* Description */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">
              About this experience
            </h2>
            <p className="text-lg text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {experience.description}
            </p>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <div className="space-y-2 mb-6">
                <p className="font-medium">{experience.locationName}</p>
                {experience.address && (
                  <p className="text-sm text-muted-foreground">
                    {experience.address}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/60 font-mono">
                  {experience.lat.toFixed(6)}, {experience.lng.toFixed(6)}
                </p>
              </div>

              {/* Embedded Map */}
              <div className="w-full aspect-square rounded-lg overflow-hidden border border-border">
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
          </div>
        </div>
      </div>
    </div>
  );
}
