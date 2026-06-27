class SearchRepository:
    def __init__(self, db_connection):
        self.conn = db_connection

    def search_place(self, keyword: str):
        with self.conn.cursor() as cur:
            sql = """
            SELECT
                name,
                category,
                address,
                ST_Y(geom) AS lat,
                ST_X(geom) AS lng
            FROM points_quynhon
            WHERE
                unaccent(LOWER(name)) LIKE unaccent(LOWER(%s))
                OR
                unaccent(LOWER(category)) LIKE unaccent(LOWER(%s))
                OR
                unaccent(LOWER(address)) LIKE unaccent(LOWER(%s))
            ORDER BY name
            LIMIT 10
            """
            cur.execute(sql, (f"%{keyword}%", f"%{keyword}%", f"%{keyword}%"))
            rows = cur.fetchall()
            return rows

    def get_categories(self):
        with self.conn.cursor() as cur:
            sql = """
            SELECT DISTINCT category
            FROM points_quynhon
            WHERE category IS NOT NULL
            ORDER BY category
            """
            cur.execute(sql)
            rows = cur.fetchall()
            return rows

    def search_category(self, category: str):
        with self.conn.cursor() as cur:
            sql = """
            SELECT
                name,
                category,
                address,
                ST_Y(geom) AS lat,
                ST_X(geom) AS lng
            FROM points_quynhon
            WHERE
                unaccent(lower(replace(category,'_',' ')))
                LIKE
                unaccent(lower(%s))
            ORDER BY name
            """
            cur.execute(sql, (f"%{category}%",))
            rows = cur.fetchall()
            return rows
