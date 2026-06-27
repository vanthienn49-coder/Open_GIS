import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="webgis_QuyNhon",
    user="postgres",
    password="1708",
    port="5433"
)

def get_connection():
    return conn