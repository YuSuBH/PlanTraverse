"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createExperience } from "@/lib/actions/create-experience";
import { UploadButton } from "@/lib/upload-thing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useTransition } from "react";
import LocationPicker from "@/components/location-picker";

export default function NewExperience() {
  const [isPending, startTransition] = useTransition();
  const [imageUrls, setImageUrls] = useState<
    Array<{ url: string; key: string }>
  >([]);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    locationName?: string;
  } | null>(null);
  const [locationNameInput, setLocationNameInput] = useState("");

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
        <h1 className="text-3xl font-bold tracking-tight">
          Share Your Experience
        </h1>
        <p className="text-muted-foreground mt-2">
          Tell the world about your amazing journey.
        </p>
      </div>

      <Card className="border-border shadow-sm">
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
                createExperience(formData);
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
                  initialLocation={
                    location
                      ? { lat: location.lat, lng: location.lng }
                      : undefined
                  }
                />
              </div>
              {!location && (
                <p className="text-sm text-yellow-600 flex items-center gap-2">
                  ⚠️ Please select a location using the map or search above
                </p>
              )}
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

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isPending}
                size="lg"
                className="w-full text-lg h-12"
              >
                {isPending ? "Sharing..." : "Share Experience"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
