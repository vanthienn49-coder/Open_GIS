import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import CategoryFilter from "../components/CategoryFilter";
import GPSButton from "../components/GPSButton";
import MapView from "../components/MapView";
import SearchBox from "../components/SearchBox";
import RoutePanel from "../components/RoutePanel";

import { getRoute } from "../services/routeService";

function Home() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [routeInfo, setRouteInfo] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Layer Control
  const [layers, setLayers] = useState({
    points: true,
    roads: true,
    boundary: true
  });

  const handleLayerChange = (layerName) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  // GPS
  const handleLocateUser = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // bỏ chọn địa điểm hiện tại
        setSelectedPlace(null);

        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error(error);
        alert("Không thể lấy vị trí hiện tại!");
      }
    );
  };

  // Dẫn đường
  const handleRoute = async () => {
    if (!selectedPlace) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const start = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const end = {
          lat: selectedPlace.lat,
          lng: selectedPlace.lng
        };

        try {
          // --- ĐOẠN ĐÃ ĐƯỢC SỬA THEO YÊU CẦU ---
          const data = await getRoute(start, end);

          const distance = (
            data.distance_m / 1000
          ).toFixed(2);

          setRouteInfo({
            distance,
            duration: "-"
          });

          const coords = data.coordinates.map(
            (coord) => [coord[1], coord[0]]
          );

          setRouteCoordinates(coords);
          // -------------------------------------

        } catch (error) {
          console.error("Lỗi khi tìm đường:", error);
          alert(
            "Không thể tính toán được tuyến đường!"
          );
        }
      },
      (error) => {
        console.error(error);
        alert(
          "Vui lòng cấp quyền định vị GPS!"
        );
      }
    );
  };

  return (
    <Container fluid>
      <Row>

        {/* Sidebar */}
        <Col md={3}>
          <div className="sidebar">

            <div className="sidebar-header">
              <div className="logo">🗺️</div>

              <h3>
                WEBGIS DU LỊCH QUY NHƠN
              </h3>

              <p>
                Hệ thống tra cứu du lịch thông minh
              </p>
            </div>

            {/* Search */}
            <div className="card-box">
              <h5>
                🔍 Tìm kiếm địa điểm
              </h5>

              <SearchBox
                onPlaceSelect={setSelectedPlace}
              />
            </div>

            {/* Category */}
            <div className="card-box">
              <h5>
                📂 Danh mục
              </h5>

              <CategoryFilter
                onCategorySelect={setSelectedCategory}
              />
            </div>

            {/* GPS */}
            <div className="card-box">
              <h5>
                📡 GPS
              </h5>

              <GPSButton
                onLocate={handleLocateUser}
              />
            </div>

            {/* Layer Control */}
            <div className="card-box">
              <h5>
                🗂 Lớp dữ liệu
              </h5>

              <div className="layer-control">

                <label>
                  <input
                    type="checkbox"
                    checked={layers.points}
                    onChange={() =>
                      handleLayerChange("points")
                    }
                  />
                  {" "}
                  Điểm du lịch
                </label>

                <br />

                <label>
                  <input
                    type="checkbox"
                    checked={layers.roads}
                    onChange={() =>
                      handleLayerChange("roads")
                    }
                  />
                  {" "}
                  Đường giao thông
                </label>

                <br />

                <label>
                  <input
                    type="checkbox"
                    checked={layers.boundary}
                    onChange={() =>
                      handleLayerChange("boundary")
                    }
                  />
                  {" "}
                  Ranh giới hành chính
                </label>

              </div>
            </div>

            {/* Info */}
            <div className="card-box">
              <h5>
                📍 Thông tin địa điểm
              </h5>

              {selectedPlace ? (
                <>
                  <p>
                    <strong>Tên:</strong>
                    <br />
                    {selectedPlace.name}
                  </p>

                  <p>
                    <strong>Loại:</strong>
                    <br />
                    {selectedPlace.category}
                  </p>

                  <p>
                    <strong>Địa chỉ:</strong>
                    <br />
                    {selectedPlace.address}
                  </p>
                </>
              ) : (
                <p>
                  Chưa chọn địa điểm
                </p>
              )}
            </div>

            {/* Route */}
            <div className="card-box">
              <RoutePanel
                selectedPlace={selectedPlace}
                routeInfo={routeInfo}
                onRoute={handleRoute}
              />
            </div>

          </div>
        </Col>

        {/* Map */}
        <Col md={9}>
          <MapView
            selectedPlace={selectedPlace}
            selectedCategory={selectedCategory}
            userLocation={userLocation}
            routeCoordinates={routeCoordinates}
            layers={layers}
          />
        </Col>

      </Row>
    </Container>
  );
}

export default Home;