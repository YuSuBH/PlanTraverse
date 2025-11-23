"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { addLocation } from "@/lib/actions/add-location";
import LocationPicker from "@/components/location-picker";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransition] = useTransition();
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
        <h1 className="text-3xl font-bold tracking-tight">Add New Location</h1>
        <p className="text-muted-foreground mt-2">
          Add a new stop to your trip itinerary.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6">
          <div className="font-semibold text-lg">Location Details</div>
          <Link href={`/trips/${tripId}`}>
            <Button variant="outline" size="sm">
              Back to Trip
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

              if (location) {
                formData.append("lat", location.lat.toString());
                formData.append("lng", location.lng.toString());
                if (location.address) {
                  formData.append("address", location.address);
                }
              }

              startTransition(() => {
                addLocation(formData, tripId);
              });
            }}
          >
            <div className="space-y-4">
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

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isPending}
                size="lg"
                className="w-full text-lg h-12"
              >
                {isPending ? "Adding Location..." : "Add Location"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
