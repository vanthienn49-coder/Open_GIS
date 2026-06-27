function PlacePopup({ place, onRoute }) {
  return (
    <div className="place-popup">
      <h5>
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>location_on</span>
        {place.name}
      </h5>

      <hr />

      <p>
        <strong>Loại:</strong><br />
        {place.category}
      </p>

      <p>
        <strong>Địa chỉ:</strong><br />
        {place.address}
      </p>

      <div className="popup-actions">
        <button className="btn-popup-detail">
          Xem chi tiết
        </button>

        <button className="btn-popup-route" onClick={onRoute}>
          Tìm đường
        </button>
      </div>
    </div>
  );
}

export default PlacePopup;