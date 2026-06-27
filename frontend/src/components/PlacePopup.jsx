function PlacePopup({
  place,
  onRoute
}) {
  return (
    <div className="place-popup">

      <h5>
        📍 {place.name}
      </h5>

      <hr />

      <p>
        <strong>Loại:</strong>
        <br />
        {place.category}
      </p>

      <p>
        <strong>Địa chỉ:</strong>
        <br />
        {place.address}
      </p>

      <div className="popup-actions">

        <button
          className="btn btn-primary btn-sm"
        >
          Xem chi tiết
        </button>

        <button
          className="btn btn-success btn-sm"
          onClick={onRoute}
        >
          Tìm đường
        </button>

      </div>

    </div>
  );
}

export default PlacePopup;