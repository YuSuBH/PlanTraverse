interface GeocodeResult {
  country: string;
  formattedAddress: string;
}

export async function getCountryFromCoords(
  lat: number,
  lon: number
): Promise<GeocodeResult> {
  const apikey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apikey}`
  );

  const data = await response.json();

  const result = data.results[0];
  const countryComponent = result.address_components.find(
    (component: { types: string[]; long_name: string }) =>
      component.types.includes("country")
  );

  return {
    country: countryComponent.long_name || "Unknown",
    formattedAddress: result.formatted_address,
  };
}
