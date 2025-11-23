"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { updateExperience } from "@/lib/actions/update-experience";
import { UploadButton } from "@/lib/upload-thing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useTransition } from "react";
import LocationPicker from "@/components/location-picker";
import { Experience, ExperienceImage } from "@/app/generated/prisma";
import Link from "next/link";

interface EditExperienceFormProps {
  experience: Experience & { images: ExperienceImage[] };
}

export default function EditExperienceForm({
  experience,
}: EditExperienceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(experience.title);
  const [description, setDescription] = useState(experience.description);
  const [locationNameInput, setLocationNameInput] = useState(
    experience.locationName
  );
  const [imageUrls, setImageUrls] = useState<
    Array<{ url: string; key: string }>
  >(experience.images.map((img) => ({ url: img.url, key: img.key })));
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    locationName?: string;
  }>({
    lat: experience.lat,
    lng: experience.lng,
    address: experience.address || undefined,
  });

  const handleLocationSelect = (locationData: {
    lat: number;
    lng: number;
    address?: string;
    locationName?: string;
  }) => {
    setLocation(locationData);

    // Auto-fill location name if provided from place search
    if (locationData.locationName) {
      setLocationNameInput(locationData.locationName);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Edit Experience</h1>
        <p className="text-muted-foreground mt-2">
          Update the details of your shared memory.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6">
          <div className="font-semibold text-lg">Experience Details</div>
          <Link href="/experiences/my">
            <Button variant="outline" size="sm">
              Back to My Experiences
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();

              // Validate location is selected
              if (!location) {
                alert("Please select a location on the map before submitting.");
                return;
              }

              const formData = new FormData(e.currentTarget);
              formData.append("experienceId", experience.id);

              if (imageUrls.length > 0) {
                formData.append("images", JSON.stringify(imageUrls));
              }
              if (location) {
                formData.append("lat", location.lat.toString());
                formData.append("lng", location.lng.toString());
                if (location.address) {
                  formData.append("address", location.address);
                }
              }

              startTransition(() => {
                updateExperience(formData);
              });
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My amazing trip to..."
                  className={cn(
                    "w-full border border-input bg-background px-4 py-3",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  )}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share your experience..."
                  rows={6}
                  className={cn(
                    "w-full border border-input bg-background px-4 py-3",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y"
                  )}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location Name
                </label>
                <input
                  type="text"
                  name="locationName"
                  placeholder="e.g., Eiffel Tower, Paris"
                  value={locationNameInput}
                  onChange={(e) => setLocationNameInput(e.target.value)}
                  className={cn(
                    "w-full border border-input bg-background px-4 py-3",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  )}
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <label className="block text-lg font-semibold text-foreground">
                Select Location{" "}
                <span className="text-destructive text-sm align-top">*</span>
              </label>
              <div className="bg-secondary/20 p-1 rounded-xl border border-border">
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={{ lat: location.lat, lng: location.lng }}
                />
              </div>
              {location?.address && (
                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md border border-border/50">
                  <strong>Address:</strong> {location.address}
                </p>
              )}
              {/* Hidden inputs for form submission */}
              <input type="hidden" name="lat" value={location?.lat || ""} />
              <input type="hidden" name="lng" value={location?.lng || ""} />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <label className="block text-lg font-semibold text-foreground">
                Images
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res) {
                      setImageUrls([
                        ...imageUrls,
                        ...res.map((file) => ({
                          url: file.url,
                          key: file.key,
                        })),
                      ]);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md text-sm font-medium transition-colors",
                    allowedContent: "text-muted-foreground text-sm mt-2",
                  }}
                />
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  {imageUrls.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-border shadow-sm"
                    >
                      <Image
                        src={img.url}
                        alt={`Upload ${idx + 1}`}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        fill
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImageUrls(imageUrls.filter((_, i) => i !== idx))
                        }
                        className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Link href="/experiences/my" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 h-12 text-base"
              >
                {isPending ? "Updating..." : "Update Experience"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
