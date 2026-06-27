function RoutePanel({
  selectedPlace,
  routeInfo,
  onRoute
}) {
  return (
    <div>

      <h5>
        🧭 Dẫn đường
      </h5>

      {!selectedPlace ? (

        <div className="route-empty">
          Chọn địa điểm để bắt đầu tìm đường
        </div>

      ) : (

        <>
          <div className="route-card">

            <div className="route-point">
              <span>📍</span>

              <div>
                <small>Từ</small>
                <p>Vị trí hiện tại</p>
              </div>
            </div>

            <div className="route-line"></div>

            <div className="route-point">
              <span>📌</span>

              <div>
                <small>Đến</small>
                <p>{selectedPlace.name}</p>
              </div>
            </div>

          </div>

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={onRoute}
          >
            🚗 Tìm đường
          </button>

          {routeInfo && (

            <div className="route-info-card">

              <div className="info-item">
                <span>📏</span>
                <div>
                  <small>Khoảng cách</small>
                  <p>{routeInfo.distance} km</p>
                </div>
              </div>

              <div className="info-item">
                <span>⏱️</span>
                <div>
                  <small>Thời gian</small>
                  <p>{routeInfo.duration} phút</p>
                </div>
              </div>

            </div>

          )}
        </>

      )}

    </div>
  );
}

export default RoutePanel;