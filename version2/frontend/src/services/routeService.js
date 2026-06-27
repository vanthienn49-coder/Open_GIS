import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function getRoute(start, end) {
  const response = await axios.get(`${API_BASE}/route`, {
    params: {
      start_lon: start.lng,
      start_lat: start.lat,
      end_lon: end.lng,
      end_lat: end.lat
    },
    timeout: 15000
  });

  const route = response.data;

  if (
    !Number.isFinite(route?.distance_m) ||
    !Array.isArray(route?.coordinates) ||
    route.coordinates.length < 2
  ) {
    throw new Error("Route API returned invalid data");
  }

  return route;
}
