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
    <div className="space-y-4">
      <div className="flex gap-2">
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
              "w-full border border-gray-300 px-3 py-2",
              "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
          />
        </Autocomplete>
        <Button
          type="button"
          onClick={handleGetCurrentLocation}
          variant="outline"
        >
          Use Current Location
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          zoom={mapZoom}
          center={mapCenter}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
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

      <p className="text-sm text-gray-600">
        💡 <strong>Tip:</strong> Search for a place, use your current location,
        or click anywhere on the map to select coordinates.
      </p>

      {selectedPosition && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <strong>Selected coordinates:</strong>{" "}
          {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
