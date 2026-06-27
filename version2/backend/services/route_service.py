import json
from typing import Callable
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from core.config import settings
from core.exceptions import ExternalServiceException, NotFoundException
from repositories.route_repository import RouteRepository
from schemas.route import RouteResponse


ExternalRouter = Callable[[float, float, float, float], RouteResponse]


def fetch_external_route(
    start_lon: float,
    start_lat: float,
    end_lon: float,
    end_lat: float,
) -> RouteResponse:
    coordinates = f"{start_lon},{start_lat};{end_lon},{end_lat}"
    url = (
        f"{settings.ROUTING_API_URL}/route/v1/driving/{coordinates}"
        "?overview=simplified&geometries=geojson&steps=false"
    )
    request = Request(url, headers={"User-Agent": "webgis-quynhon/1.0"})

    try:
        with urlopen(
            request,
            timeout=settings.ROUTING_HTTP_TIMEOUT_SECONDS,
        ) as response:
            data = json.load(response)
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise ExternalServiceException(
            "Dịch vụ định tuyến toàn quốc không khả dụng"
        ) from exc

    routes = data.get("routes", [])
    if data.get("code") != "Ok" or not routes:
        raise NotFoundException(
            "Không tìm thấy tuyến đường toàn quốc giữa hai điểm"
        )

    route = routes[0]
    route_coordinates = route.get("geometry", {}).get("coordinates", [])
    if len(route_coordinates) < 2:
        raise ExternalServiceException(
            "Dịch vụ định tuyến trả về geometry không hợp lệ"
        )

    return RouteResponse(
        provider="osrm",
        distance_m=round(float(route["distance"]), 2),
        duration_s=round(float(route["duration"]), 1),
        coordinates=route_coordinates,
    )


class RouteService:
    def __init__(
        self,
        repository: RouteRepository,
        external_router: ExternalRouter = fetch_external_route,
        max_snap_distance: float = settings.LOCAL_ROUTE_MAX_SNAP_METERS,
    ):
        self.repository = repository
        self.external_router = external_router
        self.max_snap_distance = max_snap_distance

    def _geometry_coordinates(self, geometry):
        if geometry["type"] == "LineString":
            return geometry["coordinates"]

        if geometry["type"] == "MultiLineString":
            return [point for line in geometry["coordinates"] for point in line]

        raise ValueError(f"Kiểu geometry không được hỗ trợ: {geometry['type']}")

    def shortest_path(
        self,
        start_lon: float,
        start_lat: float,
        end_lon: float,
        end_lat: float,
    ) -> RouteResponse:
        start_vertex = self.repository.get_nearest_vertex(start_lon, start_lat)
        end_vertex = self.repository.get_nearest_vertex(end_lon, end_lat)

        if not start_vertex or not end_vertex:
            raise NotFoundException("Không tìm thấy đỉnh đường gần điểm đã chọn")

        start_node, start_snap_distance = start_vertex
        end_node, end_snap_distance = end_vertex

        if (
            start_snap_distance > self.max_snap_distance
            or end_snap_distance > self.max_snap_distance
        ):
            return self.external_router(
                start_lon,
                start_lat,
                end_lon,
                end_lat,
            )

        rows = self.repository.get_shortest_path(start_node, end_node)

        if not rows:
            raise NotFoundException("Không tìm thấy tuyến đường giữa hai điểm")

        coordinates = []
        distance_m = 0.0

        for _, cost, geometry_json in rows:
            distance_m += float(cost)
            edge_coordinates = self._geometry_coordinates(json.loads(geometry_json))

            if (
                coordinates
                and edge_coordinates
                and coordinates[-1] == edge_coordinates[0]
            ):
                edge_coordinates = edge_coordinates[1:]

            coordinates.extend(edge_coordinates)

        if len(coordinates) < 2:
            raise NotFoundException("Tuyến đường không có dữ liệu hình học hợp lệ")

        return RouteResponse(
            provider="pgrouting",
            start_node=start_node,
            end_node=end_node,
            distance_m=round(distance_m, 2),
            coordinates=coordinates,
        )
