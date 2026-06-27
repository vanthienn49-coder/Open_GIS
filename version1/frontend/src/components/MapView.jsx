import { useEffect } from "react";
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

function MapView({
  selectedPlace,
  selectedCategory,
  userLocation,
  routeCoordinates = [],
  layers
}) {
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

      {/* Bản đồ nền */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Layer Điểm du lịch */}
      {layers?.points && (
        <WMSTileLayer
          url={`${GEOSERVER_URL}/wms`}
          layers={POINT_LAYER}
          format="image/png"
          transparent={true}
        />
      )}

      {/* Layer Đường giao thông */}
      {layers?.roads && (
        <WMSTileLayer
          url={`${GEOSERVER_URL}/wms`}
          layers={LINE_LAYER}
          format="image/png"
          transparent={true}
        />
      )}

      {/* Layer Ranh giới hành chính */}
      {layers?.boundary && (
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
            />
          </Popup>
        </Marker>
      )}

      {/* Tuyến đường */}
      {routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: "#1A73E8",
            weight: 6,
            opacity: 0.8
          }}
        />
      )}
    </MapContainer>
  );
}

export default MapView;