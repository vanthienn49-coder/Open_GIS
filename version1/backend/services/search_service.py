from database.db import conn

# ==================================
# Tìm kiếm địa điểm
# ==================================
def search_place(keyword):

    cur = conn.cursor()

    sql = """
    SELECT
        name,
        category,
        address,
        ST_X(geom) AS lon,
        ST_Y(geom) AS lat
    FROM points_quynhon
    WHERE
        LOWER(name) LIKE LOWER(%s)
        OR LOWER(category) LIKE LOWER(%s)
        OR LOWER(address) LIKE LOWER(%s)
    ORDER BY name
    LIMIT 10
    """

    cur.execute(
        sql,
        (
            f"%{keyword}%",
            f"%{keyword}%",
            f"%{keyword}%"
        )
    )

    rows = cur.fetchall()

    result = []

    for row in rows:
        result.append({
            "name": row[0],
            "category": row[1],
            "address": row[2],
            "lon": row[3],
            "lat": row[4]
        })

    cur.close()

    return result


# ==================================
# Lấy danh sách danh mục
# ==================================
def get_categories():

    cur = conn.cursor()

    sql = """
    SELECT DISTINCT category
    FROM points_quynhon
    WHERE category IS NOT NULL
    ORDER BY category
    """

    cur.execute(sql)

    rows = cur.fetchall()

    result = [row[0] for row in rows]

    cur.close()

    return result


# ==================================
# Tìm theo danh mục
# ==================================
def search_category(category):

    cur = conn.cursor()

    sql = """
    SELECT
        name,
        category,
        address,
        ST_X(geom) AS lon,
        ST_Y(geom) AS lat
    FROM points_quynhon
    WHERE LOWER(category) LIKE LOWER(%s)
    ORDER BY name
    """

    cur.execute(
        sql,
        (f"%{category}%",)
    )

    rows = cur.fetchall()

    result = []

    for row in rows:
        result.append({
            "name": row[0],
            "category": row[1],
            "address": row[2],
            "lon": row[3],
            "lat": row[4]
        })

    cur.close()

    return result