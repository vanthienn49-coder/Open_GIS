function LayerControl({ layers, onLayerChange }) {
  return (
    <div className="layer-control">
      <label>
        <input
          type="checkbox"
          checked={layers.points}
          onChange={() => onLayerChange('points')}
        />
        Điểm du lịch
      </label>

      <label>
        <input
          type="checkbox"
          checked={layers.roads}
          onChange={() => onLayerChange('roads')}
        />
        Đường giao thông
      </label>

      <label>
        <input
          type="checkbox"
          checked={layers.boundary}
          onChange={() => onLayerChange('boundary')}
        />
        Ranh giới hành chính
      </label>
    </div>
  );
}

export default LayerControl;