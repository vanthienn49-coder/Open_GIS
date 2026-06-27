import io
import json
import unittest
from unittest.mock import Mock, patch

from core.exceptions import NotFoundException
from schemas.route import RouteResponse
from services.route_service import RouteService, fetch_external_route


class FakeRouteRepository:
    def __init__(self, nearest_vertices, route_rows):
        self.nearest_vertices = iter(nearest_vertices)
        self.route_rows = route_rows
        self.path_calls = []

    def get_nearest_vertex(self, _lon, _lat):
        return next(self.nearest_vertices)

    def get_shortest_path(self, start_node, end_node):
        self.path_calls.append((start_node, end_node))
        return self.route_rows


class RouteServiceTests(unittest.TestCase):
    def test_uses_pgrouting_for_points_close_to_local_graph(self):
        rows = [
            (1, 125.25, json.dumps({"type": "LineString", "coordinates": [[1, 2], [3, 4]]})),
            (2, 74.75, json.dumps({"type": "LineString", "coordinates": [[3, 4], [5, 6]]})),
        ]
        repository = FakeRouteRepository([(10, 25.0), (20, 40.0)], rows)
        external_router = Mock()
        service = RouteService(repository, external_router, max_snap_distance=5000)

        result = service.shortest_path(109.1, 13.7, 109.2, 13.8)

        self.assertEqual(result.provider, "pgrouting")
        self.assertEqual(result.start_node, 10)
        self.assertEqual(result.end_node, 20)
        self.assertEqual(result.distance_m, 200.0)
        self.assertEqual(result.coordinates, [[1, 2], [3, 4], [5, 6]])
        self.assertEqual(repository.path_calls, [(10, 20)])
        external_router.assert_not_called()

    def test_uses_external_router_when_start_is_outside_local_graph(self):
        repository = FakeRouteRepository([(10, 390830.0), (20, 30.0)], [])
        external_result = RouteResponse(
            provider="osrm",
            distance_m=603176.9,
            duration_s=26865.9,
            coordinates=[[106.842601, 10.957407], [109.211127, 13.786469]],
        )
        external_router = Mock(return_value=external_result)
        service = RouteService(repository, external_router, max_snap_distance=5000)

        result = service.shortest_path(106.8426, 10.9574, 109.2110825, 13.7862534)

        self.assertEqual(result.provider, "osrm")
        self.assertEqual(result.distance_m, 603176.9)
        self.assertEqual(repository.path_calls, [])
        external_router.assert_called_once_with(
            106.8426,
            10.9574,
            109.2110825,
            13.7862534,
        )

    def test_raises_when_local_graph_has_no_path(self):
        repository = FakeRouteRepository([(10, 20.0), (20, 30.0)], [])
        service = RouteService(repository, Mock(), max_snap_distance=5000)

        with self.assertRaisesRegex(NotFoundException, "Không tìm thấy tuyến đường"):
            service.shortest_path(109.1, 13.7, 109.2, 13.8)

    @patch("services.route_service.urlopen")
    def test_external_router_parses_osrm_response(self, mock_urlopen):
        payload = {
            "code": "Ok",
            "routes": [
                {
                    "distance": 603176.9,
                    "duration": 26865.9,
                    "geometry": {
                        "coordinates": [
                            [106.842601, 10.957407],
                            [109.211127, 13.786469],
                        ]
                    },
                }
            ],
        }
        mock_urlopen.return_value = io.BytesIO(json.dumps(payload).encode())

        result = fetch_external_route(
            106.8426,
            10.9574,
            109.2110825,
            13.7862534,
        )

        self.assertEqual(result.provider, "osrm")
        self.assertEqual(result.duration_s, 26865.9)
        request = mock_urlopen.call_args.args[0]
        self.assertIn("overview=simplified", request.full_url)


if __name__ == "__main__":
    unittest.main()
