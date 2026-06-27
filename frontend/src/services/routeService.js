import axios from "axios";

export async function getRoute(start, end) {
  const response = await axios.get(
    "http://localhost:8000/api/route",
    {
      params: {
        start_lon: start.lng,
        start_lat: start.lat,
        end_lon: end.lng,
        end_lat: end.lat
      }
    }
  );

  return response.data;
}