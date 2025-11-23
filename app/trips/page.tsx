import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TripsPage() {
  const session = await auth();

  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground text-xl">
        Please sign in.
      </div>
    );
  }

  return (
    <div className="space-y-8 container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/trips/new">
          <Button size="lg">New Trip</Button>
        </Link>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl">
            Welcome back, {session.user?.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <p className="text-muted-foreground text-lg">
            {trips.length === 0
              ? "Start planning your first trip."
              : `You have ${trips.length} ${
                  trips.length === 1 ? "trip" : "trips"
                } planned. ${
                  upcomingTrips.length > 0
                    ? `${upcomingTrips.length} upcoming`
                    : ""
                }`}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Your recent trips
        </h2>
        {trips.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <h3 className="text-xl font-medium mb-2">No trips yet.</h3>
              <p className="text-center mb-6 max-w-md text-muted-foreground">
                Start planning your adventure by creating your first trip.
              </p>
              <Link href="/trips/new">
                <Button size="lg">Create Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTrips.slice(0, 6).map((trip, key) => (
              <Link key={key} href={`/trips/${trip.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 group">
                  <CardHeader>
                    <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                      {trip.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4 h-12">
                      {trip.description}
                    </p>
                    <div className="text-sm text-muted-foreground/80 font-medium">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.startDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
