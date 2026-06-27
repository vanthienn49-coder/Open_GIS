import math

def calculate_mock_route(start_lon, start_lat, end_lon, end_lat):
    """
    Hàm giả lập xử lý tìm đường.
    Sau này chỉ cần thay lõi bên trong bằng câu lệnh SQL kết nối PostGIS/pgRouting.
    """
    # 1. Tính khoảng cách đường chim bay (giả lập chiều dài tuyến đường)
    # Trong thực tế, pgRouting sẽ tính chiều dài chính xác theo các đoạn đường.
    dx = end_lon - start_lon
    dy = end_lat - start_lat
    distance_degrees = math.sqrt(dx**2 + dy**2)
    distance_km = round(distance_degrees * 111, 2) # 1 độ ~ 111km
    
    # Giả sử đi xe máy với vận tốc 40km/h
    time_minute = round((distance_km / 40) * 60, 0)
    
    # 2. Tạo một tuyến đường giả lập (GeoJSON LineString)
    # Bẻ cong tuyến đường một chút ở giữa để nhìn giống thực tế hơn thay vì một đường thẳng tắp
    mid_lon = (start_lon + end_lon) / 2
    mid_lat = (start_lat + end_lat) / 2 + 0.005 # Lệch lên trên một chút tạo độ cong

    mock_geojson = {
        "type": "Feature",
        "properties": {
            "distance_km": distance_km,
            "time_minute": time_minute
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [start_lon, start_lat],
                [mid_lon, mid_lat],
                [end_lon, end_lat]
            ]
        }
    }

    return {
        "status": "success",
        "distance": distance_km,
        "time": time_minute,
        "route": mock_geojson
    }