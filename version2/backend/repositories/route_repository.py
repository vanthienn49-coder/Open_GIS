class RouteRepository:
    def __init__(self, db_connection):
        self.conn = db_connection

    def get_nearest_vertex(self, lon: float, lat: float):
        with self.conn.cursor() as cur:
            cur.execute(
                """
                WITH input_point AS (
                    SELECT ST_SetSRID(ST_MakePoint(%s, %s), 4326) AS geom
                )
                SELECT
                    vertex.id,
                    ST_DistanceSphere(vertex.geom, input_point.geom)
                FROM roads_vertices AS vertex
                CROSS JOIN input_point
                WHERE vertex.geom IS NOT NULL
                ORDER BY vertex.geom <-> input_point.geom
                LIMIT 1
                """,
                (lon, lat),
            )
            row = cur.fetchone()
            return (row[0], float(row[1])) if row else None

    def get_shortest_path(self, start_node: int, end_node: int):
        with self.conn.cursor() as cur:
            cur.execute(
                """
                WITH route AS (
                    SELECT path_seq, node, edge, cost
                    FROM pgr_dijkstra(
                        'SELECT id::bigint, source::bigint, target::bigint,
                                cost, reverse_cost
                         FROM roads_noded',
                        %s,
                        %s,
                        directed := true
                    )
                    WHERE edge <> -1
                )
                SELECT
                    route.path_seq,
                    route.cost,
                    ST_AsGeoJSON(
                        CASE
                            WHEN route.node = road.source THEN road.geom
                            ELSE ST_Reverse(road.geom)
                        END
                    )
                FROM route
                JOIN roads_noded AS road ON road.id = route.edge
                ORDER BY route.path_seq
                """,
                (start_node, end_node),
            )
            rows = cur.fetchall()
            return rows
