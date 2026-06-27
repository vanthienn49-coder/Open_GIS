function LayerControl({
  showPoint,
  setShowPoint,

  showRoad,
  setShowRoad,

  showBoundary,
  setShowBoundary
}) {
  return (
    <div>

      <label className="layer-item">
        <input
          type="checkbox"
          checked={showPoint}
          onChange={() =>
            setShowPoint(!showPoint)
          }
        />

        <span>
          Điểm du lịch
        </span>
      </label>

      <label className="layer-item">
        <input
          type="checkbox"
          checked={showRoad}
          onChange={() =>
            setShowRoad(!showRoad)
          }
        />

        <span>
          Đường giao thông
        </span>
      </label>

      <label className="layer-item">
        <input
          type="checkbox"
          checked={showBoundary}
          onChange={() =>
            setShowBoundary(!showBoundary)
          }
        />

        <span>
          Ranh giới hành chính
        </span>
      </label>

    </div>
  );
}

export default LayerControl;