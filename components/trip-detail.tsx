"use client";

import { Location, Trip } from "@/app/generated/prisma";
import Image from "next/image";
import { Calendar, MapPin, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import Map from "@/components/map";
import SortableItinerary from "./sortable-itinerary";

export type TripWithLocation = Trip & {
  locations: Location[];
};

interface TripDetailClientProps {
  trip: TripWithLocation;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {trip.imageUrl && (
        <div className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-sm relative">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              {trip.title}
            </h1>
            <div className="flex items-center text-white/90 text-lg font-medium">
              <Calendar className="h-5 w-5 mr-3" />
              <span>
                {trip.startDate.toLocaleDateString()} -{" "}
                {trip.endDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {!trip.imageUrl && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {trip.title}
            </h1>

            <div className="flex items-center text-muted-foreground text-lg">
              <Calendar className="h-5 w-5 mr-3" />
              <span>
                {trip.startDate.toLocaleDateString()} -{" "}
                {trip.endDate.toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link href={`/trips/${trip.id}/itinerary/new`}>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" /> Add Location
              </Button>
            </Link>
          </div>
        </div>
      )}

      {trip.imageUrl && (
        <div className="flex justify-end">
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" /> Add Location
            </Button>
          </Link>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border px-6 pt-4">
            <TabsList className="bg-transparent p-0 h-auto space-x-8">
              <TabsTrigger
                value="overview"
                className="text-lg px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="text-lg px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="text-lg px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Map
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 md:p-8">
            <TabsContent value="overview" className="mt-0 space-y-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-6">
                      Trip Summary
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-start p-4 bg-secondary/50 rounded-lg">
                        <Calendar className="h-6 w-6 mr-4 text-primary mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Dates</p>
                          <p className="text-muted-foreground mt-1">
                            {trip.startDate.toLocaleDateString()} -{" "}
                            {trip.endDate.toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground/80 mt-1">
                            {`${Math.round(
                              (trip.endDate.getTime() -
                                trip.startDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                            )} day(s)`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start p-4 bg-secondary/50 rounded-lg">
                        <MapPin className="h-6 w-6 mr-4 text-primary mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Destinations
                          </p>
                          <p className="text-muted-foreground mt-1">
                            {trip.locations.length}{" "}
                            {trip.locations.length === 1
                              ? "location"
                              : "locations"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {trip.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
                    <Map itineraries={trip.locations} />
                  </div>
                  {trip.locations.length === 0 && (
                    <div className="text-center p-6 bg-secondary/30 rounded-lg border border-dashed border-border">
                      <p className="text-muted-foreground mb-4">
                        Add locations to see them on the map.
                      </p>
                      <Link href={`/trips/${trip.id}/itinerary/new`}>
                        <Button variant="outline">
                          <Plus className="mr-2 h-4 w-4" /> Add Location
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="itinerary" className="mt-0 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">
                  Full Itinerary
                </h2>
              </div>
              {trip.locations.length === 0 ? (
                <div className="text-center py-16 bg-secondary/30 rounded-xl border border-dashed border-border">
                  <p className="text-lg text-muted-foreground mb-6">
                    Your itinerary is empty.
                  </p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button size="lg">
                      <Plus className="mr-2 h-5 w-5" /> Add First Location
                    </Button>
                  </Link>
                </div>
              ) : (
                <SortableItinerary
                  locations={trip.locations}
                  tripId={trip.id}
                />
              )}
            </TabsContent>

            <TabsContent value="map" className="mt-0 space-y-6">
              <div className="h-[600px] rounded-xl overflow-hidden border border-border shadow-sm">
                <Map itineraries={trip.locations} />
              </div>
              {trip.locations.length === 0 && (
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-4">
                    Add locations to see them on the map.
                  </p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button>
                      <Plus className="mr-2 h-5 w-5" /> Add Location
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="text-center pt-8">
        <Link href={`/trips`}>
          <Button variant="outline" size="lg">
            Back to Trips
          </Button>
        </Link>
      </div>
    </div>
  );
}
