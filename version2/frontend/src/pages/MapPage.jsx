import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CategoryFilter from '../components/CategoryFilter';
import GPSButton from '../components/GPSButton';
import MapView from '../components/MapView';
import SearchBox from '../components/SearchBox';
import RoutePanel from '../components/RoutePanel';
import LayerControl from '../components/LayerControl';

import { getRoute } from '../services/routeService';

function MapPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || null;

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [userLocation, setUserLocation] = useState(null);

  const [routeInfo, setRouteInfo] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        setSelectedPlace(null);
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error(error);
        alert('Không thể lấy vị trí hiện tại!');
      }
    );
  };

  // Routing
  const handleRoute = async () => {
    if (!selectedPlace) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const start = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setUserLocation(start);

        const end = {
          lat: selectedPlace.lat,
          lng: selectedPlace.lng
        };

        try {
          const data = await getRoute(start, end);
          const distance = (data.distance_m / 1000).toFixed(2);

          setRouteInfo({
            distance,
            duration: Number.isFinite(data.duration_s)
              ? Math.round(data.duration_s / 60)
              : null
          });

          const coords = data.coordinates.map((coord) => [coord[1], coord[0]]);
          setRouteCoordinates(coords);
        } catch (error) {
          console.error('Lỗi khi tìm đường:', error);
          alert('Không thể tính toán được tuyến đường!');
        }
      },
      (error) => {
        console.error(error);
        alert('Vui lòng cấp quyền định vị GPS!');
      }
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="map-page">
      {/* Sidebar */}
      <aside className={`sidebar custom-scrollbar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-content">
          {/* Brand Header */}
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <span className="material-symbols-outlined">map</span>
            </div>
            <div className="sidebar-brand">
              <h2>WEBGIS DU LỊCH QUY NHƠN</h2>
              <p>Hệ thống tra cứu du lịch thông minh</p>
            </div>
          </div>

          {/* Search */}
          <div className="card-panel">
            <div className="card-panel-header">
              <span className="material-symbols-outlined">search</span>
              <h3 className="card-panel-title">Tìm kiếm địa điểm</h3>
            </div>
            <SearchBox
              onPlaceSelect={setSelectedPlace}
              initialKeyword={initialSearch}
            />
          </div>

          {/* Category */}
          <div className="card-panel">
            <div className="card-panel-header">
              <span className="material-symbols-outlined">folder</span>
              <h3 className="card-panel-title">Danh mục</h3>
            </div>
            <CategoryFilter
              onCategorySelect={setSelectedCategory}
              initialCategory={initialCategory}
            />
          </div>

          {/* GPS */}
          <div className="card-panel">
            <div className="card-panel-header">
              <span className="material-symbols-outlined">satellite_alt</span>
              <h3 className="card-panel-title">GPS</h3>
            </div>
            <GPSButton onLocate={handleLocateUser} />
          </div>

          {/* Layer Control */}
          <div className="card-panel">
            <div className="card-panel-header">
              <span className="material-symbols-outlined">layers</span>
              <h3 className="card-panel-title">Lớp dữ liệu</h3>
            </div>
            <LayerControl layers={layers} onLayerChange={handleLayerChange} />
          </div>

          {/* Place Info */}
          <div className="card-panel">
            <div className="card-panel-header">
              <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>location_on</span>
              <h3 className="card-panel-title">Thông tin địa điểm</h3>
            </div>
            {selectedPlace ? (
              <div className="place-info">
                <p><strong>Tên:</strong> {selectedPlace.name}</p>
                <p><strong>Loại:</strong> {selectedPlace.category}</p>
                <p><strong>Địa chỉ:</strong> {selectedPlace.address}</p>
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Chưa chọn địa điểm</p>
            )}
          </div>

          {/* Route */}
          <div className="card-panel">
            <RoutePanel
              selectedPlace={selectedPlace}
              routeInfo={routeInfo}
              onRoute={handleRoute}
            />
          </div>
        </div>
      </aside>

      {/* Sidebar Toggle (Mobile) */}
      {!sidebarOpen && (
        <button className="sidebar-toggle-btn visible" onClick={toggleSidebar}>
          <span className="material-symbols-outlined">layers</span>
        </button>
      )}

      {/* Map */}
      <main className="map-container">
        <MapView
          selectedPlace={selectedPlace}
          selectedCategory={selectedCategory}
          userLocation={userLocation}
          routeCoordinates={routeCoordinates}
          layers={layers}
          onRoute={handleRoute}
        />
      </main>

      {/* Map Controls */}
      <div className="map-controls">
        <div className="map-controls-group">
          <button className="map-control-btn" title="Phóng to" id="zoom-in-btn">
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className="map-control-btn" title="Thu nhỏ" id="zoom-out-btn">
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
        <button className="map-control-single" title="Vị trí của tôi" onClick={handleLocateUser}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
        </button>
        <button className="map-control-single" title="La bàn">
          <span className="material-symbols-outlined">explore</span>
        </button>
      </div>

      {/* Legend */}
      <div className="legend-panel">
        <div className="legend-header">
          <h4>Chú giải</h4>
          <span className="material-symbols-outlined" style={{ color: 'var(--outline)', cursor: 'pointer' }}>keyboard_arrow_down</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: 'var(--primary)' }} />
          <span className="legend-label">Đất ở đô thị (ODT)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: 'var(--secondary)' }} />
          <span className="legend-label">Công viên cây xanh (CX)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch-dashed" />
          <span className="legend-label">Ranh giới Quy Nhơn (Hành chính)</span>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
