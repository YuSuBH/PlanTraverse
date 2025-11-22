import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return new NextResponse("Missing lat or lng parameters", { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return new NextResponse("Google Maps API key not configured", {
        status: 500,
      });
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      return NextResponse.json({ address: null });
    }

    const result = data.results[0];
    return NextResponse.json({ address: result.formatted_address });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
