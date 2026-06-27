import { useState } from "react";
import API_URL from "../services/api";

function SearchBox({ onPlaceSelect }) {

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {

    setKeyword(value);

    if (!value.trim()) {

      setResults([]);
      return;

    }

    try {

      const response = await fetch(
        `${API_URL}/search?keyword=${encodeURIComponent(value)}`
      );

      const data = await response.json();

      setResults(data);

    } catch (error) {

      console.error(
        "Lỗi tìm kiếm:",
        error
      );

      setResults([]);
    }
  };

  return (
    <div>

      <input
        type="text"
        className="form-control"
        placeholder="🔍 Tìm địa điểm..."
        value={keyword}
        onChange={(e) =>
          handleSearch(e.target.value)
        }
      />

      {keyword && (

        <div className="search-results">

          {results.length > 0 ? (

            results.map((place, index) => (

              <div
                key={index}
                className="search-card"
              >

                <div>

                  <h6 className="place-name">
                    📍 {place.name}
                  </h6>

                  <p className="place-category">
                    {place.category}
                  </p>

                  <p className="place-address">
                    {place.address}
                  </p>

                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {

                    onPlaceSelect({
                      name: place.name,
                      category: place.category,
                      address: place.address,

                      lat: place.lat,
                      lng: place.lon
                    });

                    setKeyword("");
                    setResults([]);
                  }}
                >
                  Xem
                </button>

              </div>

            ))

          ) : (

            <div className="no-result">
              Không tìm thấy địa điểm
            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default SearchBox;