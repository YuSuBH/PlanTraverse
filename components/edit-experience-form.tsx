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
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>Edit Experience</div>
          <Link href="/experiences/my">
            <Button variant="outline" size="sm">
              Back to My Experiences
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My amazing trip to..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your experience..."
                rows={6}
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name
              </label>
              <input
                type="text"
                name="locationName"
                placeholder="e.g., Eiffel Tower, Paris"
                value={locationNameInput}
                onChange={(e) => setLocationNameInput(e.target.value)}
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Location <span className="text-red-500">*</span>
              </label>
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={{ lat: location.lat, lng: location.lng }}
              />
              {location?.address && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Address:</strong> {location.address}
                </p>
              )}
              {/* Hidden inputs for form submission */}
              <input type="hidden" name="lat" value={location?.lat || ""} />
              <input type="hidden" name="lng" value={location?.lng || ""} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    setImageUrls([
                      ...imageUrls,
                      ...res.map((file) => ({ url: file.url, key: file.key })),
                    ]);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {imageUrls.map((img, idx) => (
                    <div key={idx} className="relative">
                      <Image
                        src={img.url}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                        width={200}
                        height={200}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImageUrls(imageUrls.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Link href="/experiences/my" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Updating..." : "Update Experience"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
