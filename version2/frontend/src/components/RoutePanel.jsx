function formatDuration(minutes) {
  if (!Number.isFinite(minutes)) return 'Chưa có dữ liệu';
  if (minutes < 60) return `${minutes} phút`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} giờ ${remainingMinutes} phút`
    : `${hours} giờ`;
}

function RoutePanel({ selectedPlace, routeInfo, onRoute }) {
  return (
    <div>
      <div className="card-panel-header">
        <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>explore</span>
        <h3 className="card-panel-title">Dẫn đường</h3>
      </div>

      {!selectedPlace ? (
        <div className="route-empty">
          Chọn địa điểm để bắt đầu tìm đường
        </div>
      ) : (
        <>
          <div className="route-card">
            <div className="route-point">
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>my_location</span>
              <div>
                <small>Từ</small>
                <p>Vị trí hiện tại</p>
              </div>
            </div>

            <div className="route-line" />

            <div className="route-point">
              <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>location_on</span>
              <div>
                <small>Đến</small>
                <p>{selectedPlace.name}</p>
              </div>
            </div>
          </div>

          <button className="route-btn" onClick={onRoute}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>directions_car</span>
            Tìm đường
          </button>

          {routeInfo && (
            <div className="route-info-card">
              <div className="info-item">
                <span className="material-symbols-outlined">straighten</span>
                <div>
                  <small>Khoảng cách</small>
                  <p>{routeInfo.distance} km</p>
                </div>
              </div>

              <div className="info-item">
                <span className="material-symbols-outlined">schedule</span>
                <div>
                  <small>Thời gian</small>
                  <p>{formatDuration(routeInfo.duration)}</p>
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
