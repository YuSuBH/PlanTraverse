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
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>Add New Location to Itinerary</div>
          <Link href={`/trips/${tripId}`}>
            <Button variant="outline" size="sm">
              Back to Trip
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
                initialLocation={
                  location
                    ? { lat: location.lat, lng: location.lng }
                    : undefined
                }
              />
              {!location && (
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ Please select a location using the map or search above
                </p>
              )}
              {location?.address && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Address:</strong> {location.address}
                </p>
              )}
              {/* Hidden inputs for form submission */}
              <input type="hidden" name="lat" value={location?.lat || ""} />
              <input type="hidden" name="lng" value={location?.lng || ""} />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Adding..." : "Add Location"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
