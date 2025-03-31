import React, { useState, useLayoutEffect, useEffect } from "react";
import "../../styles/Filter.css";

function FilterComponent({ onFilterChange, condition }) {
  // 필터
  const [filters, setFilters] = useState({
    brands: new Set(),
    labels: new Set(),
    categories: new Set(),
    priceRanges: new Set(),
  });

  // 브랜드
  const [brands, setBrands] = useState([
    {
      brandId: 0,
      brandTitle: null,
    },
  ]);

  // 가격
  const priceRanges = [
    { id: 1, name: "$0 - $50" },
    { id: 2, name: "$51 - $100" },
    { id: 3, name: "$101 - $200" },
    // { id: 4, name: "$201 - " + maxPrice },
  ];

  // 라벨
  const [labels, setLabels] = useState([
    {
      labelId: 0,
      labelTitle: null,
    },
  ]);

  // 카테고리
  const [categories, setRelatedCategories] = useState([
    {
      categoryId: 0,
      categoryName: null,
    },
  ]);

  // 필터 선택 수정
  const handleFilterChange = (type, id) => {
    const newFilters = { ...filters };
    if (newFilters[type].has(id)) {
      newFilters[type].delete(id);
    } else {
      newFilters[type].add(id);
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // 필터 초기화
  const resetFilters = () => {
    const resetState = {
      brands: new Set(),
      labels: new Set(),
      categories: new Set(),
      priceRanges: new Set(),
    };
    setFilters(resetState);
    onFilterChange(resetState);
  };

  useEffect(() => {
    console.log(condition);
    console.log(condition.endRangePrice);
    console.log(condition.brands);
    console.log(condition.labels);
    console.log(condition.relatedDownCategorys);

    setBrands(condition.brands); // 브랜드 필터 세팅
    setLabels(condition.labels); // 라벨 필터 세팅
    setRelatedCategories(condition.relatedDownCategorys); // 연관 카테고리 필터 세팅

    // setFilters({
    //   brands: brandList.map(brandDataMapping),
    //   labels: labelList,
    //   categories: relatedCategoryList,
    //   priceRanges: priceRanges,
    // });
  }, []);

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h2>Filters</h2>
        <button className="reset-button" onClick={resetFilters}>
          Reset All
        </button>
      </div>

      <div className="filter-section">
        <h3>브랜드</h3>
        <div className="checkbox-group">
          {brands.map((brand) => (
            <label key={brand.brandId} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.brands.has(brand.brandId)}
                onChange={() => handleFilterChange("brands", brand.brandId)}
              />
              <span className="checkbox-text">{brand.brandTitle}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>라벨</h3>
        <div className="checkbox-group">
          {labels.map((label) => (
            <label key={label.labelId} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.labels.has(label.labelId)}
                onChange={() => handleFilterChange("labels", label.labelId)}
              />
              <span className="checkbox-text">{label.labelTitle}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 영역 */}
      {/* <div className="filter-section">
        <h3>카테고리</h3>
        <div className="checkbox-group">
          {categories.map((category) => (
            <label key={category.categoryId} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.categories.has(category.categoryId)}
                onChange={() => handleFilterChange("categories", category.categoryId)}
              />
              <span className="checkbox-text">{category.categoryName}</span>
            </label>
          ))}
        </div>
      </div> */}

      <div className="filter-section">
        <h3>가격</h3>
        <div className="checkbox-group">
          {priceRanges.map((range) => (
            <label key={range.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.priceRanges.has(range.id)}
                onChange={() => handleFilterChange("priceRanges", range.id)}
              />
              <span className="checkbox-text">{range.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterComponent;
