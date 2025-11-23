"use client";

import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address?: string;
    locationName?: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
  };
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
}: LocationPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation || null);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    initialLocation || { lat: 20, lng: 0 }
  );

  const [mapZoom, setMapZoom] = useState(initialLocation ? 15 : 2);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setSelectedPosition({ lat, lng });

      // Reverse geocode to get address
      try {
        const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
        const data = await response.json();
        if (data.address) {
          onLocationSelect({
            lat,
            lng,
            address: data.address,
          });
        } else {
          onLocationSelect({ lat, lng });
        }
      } catch (error) {
        console.error("Failed to get address:", error);
        onLocationSelect({ lat, lng });
      }
    }
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      // Check if place has valid geometry (user selected from dropdown)
      if (!place || !place.geometry || !place.geometry.location) {
        // User pressed enter without selecting from dropdown, ignore
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setSelectedPosition({ lat, lng });
      setMapCenter({ lat, lng });
      setMapZoom(15);

      onLocationSelect({
        lat,
        lng,
        address: place.formatted_address,
        locationName: place.name,
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setSelectedPosition({ lat, lng });
          setMapCenter({ lat, lng });
          setMapZoom(15);

          try {
            const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
            const data = await response.json();
            if (data.address) {
              onLocationSelect({ lat, lng, address: data.address });
            } else {
              onLocationSelect({ lat, lng });
            }
          } catch (error) {
            console.error("Failed to get address:", error);
            onLocationSelect({ lat, lng });
          }
        },
        (error) => {
          alert("Unable to retrieve your location.");
          console.error(error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceSelect}
          className="flex-1"
        >
          <input
            type="text"
            placeholder="Search for a place (e.g., Eiffel Tower, Paris)"
            className={cn(
              "w-full border border-input bg-background px-4 py-3",
              "rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            )}
          />
        </Autocomplete>
        <Button
          type="button"
          onClick={handleGetCurrentLocation}
          variant="outline"
          className="h-[50px] px-6"
        >
          Use Current Location
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden shadow-sm">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "450px" }}
          zoom={mapZoom}
          center={mapCenter}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {selectedPosition && (
            <Marker
              position={selectedPosition}
              draggable={true}
              onDragEnd={handleMapClick}
            />
          )}
        </GoogleMap>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground bg-secondary/30 p-4 rounded-lg border border-border/50">
        <p>
          💡 <strong>Tip:</strong> Search for a place, use your current
          location, or click anywhere on the map to select coordinates.
        </p>
        {selectedPosition && (
          <div className="font-mono text-xs bg-background px-2 py-1 rounded border border-border">
            {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
}
