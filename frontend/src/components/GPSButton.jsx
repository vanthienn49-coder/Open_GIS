function GPSButton({
  onLocate
}) {
  return (
    <button
      className="gps-btn"
      onClick={onLocate}
    >
      📍 Vị trí của tôi
    </button>
  );
}

export default GPSButton;