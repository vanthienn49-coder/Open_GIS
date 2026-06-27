import { useEffect, useState } from "react";
import {
  MapContainer,
  Polyline,
  TileLayer,
  WMSTileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import PlacePopup from "./PlacePopup";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import {
  GEOSERVER_URL,
  POINT_LAYER,
  LINE_LAYER,
  POLYGON_LAYER
} from "../services/geoserver";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function FlyToPlace({
  selectedPlace,
  userLocation
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo(
        [
          selectedPlace.lat,
          selectedPlace.lng
        ],
        17
      );
    }
  }, [selectedPlace, map]);

  useEffect(() => {
    if (
      userLocation &&
      !selectedPlace
    ) {
      map.flyTo(
        [
          userLocation.lat,
          userLocation.lng
        ],
        16
      );
    }
  }, [
    userLocation,
    selectedPlace,
    map
  ]);

  return null;
}

function FitRoute({ routeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates.length < 2) return;

    map.fitBounds(routeCoordinates, {
      padding: [40, 40],
      maxZoom: 15
    });
  }, [map, routeCoordinates]);

  return null;
}

function MapView({
  selectedPlace,
  selectedCategory,
  userLocation,
  routeCoordinates = [],
  layers,
  onRoute
}) {
  const [categoryPlaces, setCategoryPlaces] = useState([]);

  useEffect(() => {
    if (!selectedCategory) return undefined;

    const controller = new AbortController();

    const fetchCategoryPlaces = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/search/category?category=${encodeURIComponent(selectedCategory)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        setCategoryPlaces(await response.json());
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Lỗi tải địa điểm theo danh mục:", error);
          setCategoryPlaces([]);
        }
      }
    };

    fetchCategoryPlaces();

    return () => controller.abort();
  }, [selectedCategory]);

  // Only render WMS layers if GeoServer URL is configured
  const hasGeoServer = GEOSERVER_URL && GEOSERVER_URL.trim() !== "";

  return (
    <MapContainer
      center={[13.782, 109.219]}
      zoom={13}
      style={{
        height: "100vh",
        width: "100%"
      }}
    >
      <FlyToPlace
        selectedPlace={selectedPlace}
        userLocation={userLocation}
      />

      <FitRoute routeCoordinates={routeCoordinates} />

      {/* Bản đồ nền */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Layer Điểm du lịch */}
      {hasGeoServer && layers?.points && (
        <WMSTileLayer
          url={`${GEOSERVER_URL}/wms`}
          layers={POINT_LAYER}
          format="image/png"
          transparent={true}
        />
      )}

      {/* Layer Đường giao thông */}
      {hasGeoServer && layers?.roads && (
        <WMSTileLayer
          url={`${GEOSERVER_URL}/wms`}
          layers={LINE_LAYER}
          format="image/png"
          transparent={true}
        />
      )}

      {/* Layer Ranh giới hành chính */}
      {hasGeoServer && layers?.boundary && (
        <WMSTileLayer
          url={`${GEOSERVER_URL}/wms`}
          layers={POLYGON_LAYER}
          format="image/png"
          transparent={true}
        />
      )}

      {/* GPS */}
      {userLocation && (
        <Marker
          position={[
            userLocation.lat,
            userLocation.lng
          ]}
        >
          <Popup>
            <div
              style={{
                textAlign: "center"
              }}
            >
              <h6>
                📍 Vị trí của bạn
              </h6>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px"
                }}
              >
                Bạn đang ở đây
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Địa điểm được chọn */}
      {selectedPlace && (
        <Marker
          position={[
            selectedPlace.lat,
            selectedPlace.lng
          ]}
        >
          <Popup>
            <PlacePopup
              place={selectedPlace}
              onRoute={onRoute}
            />
          </Popup>
        </Marker>
      )}

      {/* Các địa điểm thuộc danh mục được chọn */}
      {selectedCategory && categoryPlaces.map((place, index) => (
        <Marker
          key={place.id || `${place.name}-${index}`}
          position={[place.lat, place.lng]}
        >
          <Popup>
            <PlacePopup place={place} />
          </Popup>
        </Marker>
      ))}

      {/* Tuyến đường */}
      {routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: "#005d90",
            weight: 6,
            opacity: 0.8
          }}
        />
      )}
    </MapContainer>
  );
}

export default MapView;
