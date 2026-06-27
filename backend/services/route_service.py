from database.db import conn
import json


def shortest_path(
        start_lon,
        start_lat,
        end_lon,
        end_lat):

    cur = conn.cursor()

    # ==========================
    # Tìm node gần điểm đầu
    # ==========================

    cur.execute("""
        SELECT id
        FROM roads_vertices
        ORDER BY geom <-> ST_SetSRID(
            ST_MakePoint(%s,%s),
            4326
        )
        LIMIT 1
    """,
    (start_lon,start_lat))

    start_vid = cur.fetchone()[0]
    print(start_vid)

    # ==========================
    # Tìm node gần điểm cuối
    # ==========================

    cur.execute("""
        SELECT id
        FROM roads_vertices
        ORDER BY geom <-> ST_SetSRID(
            ST_MakePoint(%s,%s),
            4326
        )
        LIMIT 1
    """,
    (end_lon,end_lat))

    end_vid = cur.fetchone()[0]
    print(end_vid)

    # ==========================
    # Chạy Dijkstra
    # ==========================

    sql = """
    SELECT
        r.path_seq,
        r.cost,
        r.agg_cost,
        ST_AsGeoJSON(l.geom)
    FROM roads_noded l

    JOIN
    (
        SELECT *
        FROM pgr_dijkstra(
        '
        SELECT
            id::bigint,
            source,
            target,
            cost,
            reverse_cost
        FROM roads_noded
        ',
        %s,
        %s
        )
    ) r

    ON l.id::bigint = r.edge

    WHERE r.edge <> -1

    ORDER BY r.path_seq
    """

    cur.execute(
        sql,
        (start_vid,end_vid)
    )

    rows = cur.fetchall()
    
    coordinates = []

    total_cost = 0

    for row in rows:

        total_cost += row[1]

        geom = json.loads(row[3])

        if geom["type"] == "LineString":

            for p in geom["coordinates"]:

                coordinates.append(
                    [p[0],p[1]]
                )

    cur.close()

    return {
        "start_vid": start_vid,
        "end_vid": end_vid,
        "distance_m": round(total_cost,2),
        "coordinates": coordinates
    }