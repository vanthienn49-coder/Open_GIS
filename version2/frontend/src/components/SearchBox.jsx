import { useState, useEffect } from 'react';
import { touristPlaces } from '../services/mockData';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function SearchBox({ onPlaceSelect, initialKeyword = '' }) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = keyword.trim();
    if (!query) return undefined;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_BASE}/search?keyword=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        if (error.name === 'AbortError') return;

        console.warn('API search failed, falling back to local data:', error.message);

        const filtered = touristPlaces.filter((place) =>
          place.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword]);

  const handleKeywordChange = (event) => {
    const value = event.target.value;
    setKeyword(value);

    if (!value.trim()) {
      setResults([]);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '20px',
            color: 'var(--outline)'
          }}
        >
          search
        </span>
        <input
          type="text"
          className="input-search"
          placeholder="Tìm địa điểm..."
          value={keyword}
          onChange={handleKeywordChange}
        />
      </div>

      {keyword && (
        <div className="search-results">
          {loading ? (
            <div className="no-result">Đang tìm kiếm...</div>
          ) : results.length > 0 ? (
            results.map((place, index) => (
              <div key={place.id || index} className="search-card">
                <div className="search-card-info">
                  <h6 className="place-name">
                    {place.name}
                  </h6>
                  <p className="place-category">{place.category}</p>
                  <p className="place-address">{place.address}</p>
                </div>

                <button
                  className="btn-view"
                  onClick={() => {
                    onPlaceSelect(place);
                    setKeyword('');
                    setResults([]);
                  }}
                >
                  Xem
                </button>
              </div>
            ))
          ) : (
            <div className="no-result">Không tìm thấy địa điểm</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBox;
