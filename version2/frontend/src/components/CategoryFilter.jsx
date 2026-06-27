import { useState, useEffect } from 'react';
import { touristPlaces } from '../services/mockData';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function CategoryFilter({ onCategorySelect, initialCategory = null }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/categories`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const categoryList = Array.isArray(data)
          ? data
          : data.categories;

        if (!Array.isArray(categoryList)) {
          throw new Error('Invalid categories response');
        }

        setCategories(categoryList);
      } catch (error) {
        if (error.name === 'AbortError') return;

        console.warn('API categories failed, falling back to local data:', error.message);

        const localCategories = [
          ...new Set(
            touristPlaces.map((place) => place.category)
          )
        ];
        setCategories(localCategories);
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  // If there's an initial category from URL, trigger it
  useEffect(() => {
    if (initialCategory) {
      onCategorySelect(initialCategory);
    }
  }, [initialCategory, onCategorySelect]);

  const handleClick = (category) => {
    const newActive = activeCategory === category ? null : category;
    setActiveCategory(newActive);
    onCategorySelect(newActive);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${activeCategory === category ? 'active' : ''}`}
          onClick={() => handleClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
