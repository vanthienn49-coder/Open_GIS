function GPSButton({ onLocate }) {
  return (
    <button className="gps-btn" onClick={onLocate}>
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>location_on</span>
      Vị trí của tôi
    </button>
  );
}

export default GPSButton;