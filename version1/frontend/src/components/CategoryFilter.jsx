import { useEffect, useState } from "react";
import API_URL from "../services/api";

function CategoryFilter({
  onCategorySelect
}) {

  const [categories, setCategories] =
    useState([]);

  useEffect(() => {

    fetch(
      `${API_URL}/categories`
    )
      .then((res) => res.json())
      .then((data) =>
        setCategories(data)
      )
      .catch((err) =>
        console.error(err)
      );

  }, []);

  return (
    <div>

      {categories.map((category) => (

        <button
          key={category}
          className="category-btn"
          onClick={() =>
            onCategorySelect(category)
          }
        >
          {category}
        </button>

      ))}

    </div>
  );
}

export default CategoryFilter;