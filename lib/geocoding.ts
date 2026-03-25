interface NominatimAddress {
  road?: string;
  suburb?: string;
  quarter?: string;
  neighbourhood?: string;
  city_district?: string;
  city?: string;
  province?: string;
  state?: string;
  [key: string]: string | undefined;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

function buildAddress(address: NominatimAddress): string | null {
  const city =
    address.city || address.province || address.state;
  const district =
    address.city_district ||
    address.suburb ||
    address.quarter ||
    address.neighbourhood;
  const road = address.road;

  const parts: string[] = [];
  if (city) parts.push(city);
  if (district) parts.push(district);
  if (road) parts.push(road);

  return parts.join(" ") || null;
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ko`;
    const response = await fetch(url, {
      signal,
      headers: {
        "User-Agent": "duecast/1.0 (weather app)",
      },
    });

    if (!response.ok) return null;

    const data: NominatimResponse = await response.json();

    if (data.address) {
      const built = buildAddress(data.address);
      if (built) return built;
    }

    return data.display_name?.split(",")[0]?.trim() ?? null;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return null;
    return null;
  }
}
