function SearchResult({
  place,
  onSelect
}) {
  return (
    <div
      className="search-result-card"
      onClick={() => onSelect(place)}
    >
      <h6>
        📍 {place.name}
      </h6>

      <p>
        {place.category}
      </p>

      <small>
        {place.address}
      </small>

      <button
        className="view-btn"
      >
        Xem
      </button>
    </div>
  );
}

export default SearchResult;