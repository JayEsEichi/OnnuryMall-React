import React, { useState, useCallback, useEffect, useRef } from "react";
import { Range, getTrackBackground } from "react-range";
import { useParams } from "react-router-dom";

// Component Contents
import ProductCard from "../../components/Product/ProductCard";
import Pagination from "../../components/Pagination/Pagination";

// API
import { getSelectCategoryProducts } from "../../apis/api/product";

// CSS
import "../../styles/SelectCategoryProducts.css";
import "../../styles/PriceRangeFilter.css";

// 선택 카테고리 연관 제품 리스트 카드
function selectCategoryProductCard(Product) {
  return (
    <ProductCard
      key={"c" + Product.productId}
      thumbnailImg={Product.mediaList[0].imgUrl}
      brand={Product.brand}
      productType={Product.deliveryType}
      productName={Product.productName}
      sellPrice={Product.sellPrice}
    />
  );
}

function SelectCategoryProductsPage() {
  // 제품 총 갯수
  const [productCount, setProductCount] = useState(0);

  // 조회된 제품들 중 가장 큰 가격
  const [maxPrice, setMaxPrice] = useState(0);

  // 제품 리스트
  const [products, setProducts] = useState([
    {
      supplierId: 0,
      brandId: 0,
      brand: null,
      upCategoryId: 0,
      upCategory: null,
      middleCategoryId: 0,
      middleCategory: null,
      downCategoryId: 0,
      downCategory: null,
      productId: 0,
      productName: null,
      classificationCode: null,
      labelList: [
        {
          labelId: 0,
          labelTitle: null,
          colorCode: null,
          startPostDate: null,
          endPostDate: null,
          imgUrl: null,
          topExpression: null,
        },
      ],
      modelNumber: null,
      deliveryType: null,
      sellClassification: null,
      expressionCheck: null,
      normalPrice: 0,
      sellPrice: 0,
      deliveryPrice: 0,
      purchasePrice: 0,
      eventStartDate: null,
      eventEndDate: null,
      eventDescription: null,
      optionCheck: null,
      productOptionList: [
        {
          productOptionId: 0,
          productOptionTitle: null,
          necessaryCheck: null,
          productDetailOptionList: [
            {
              detailOptionId: 0,
              detailOptionName: null,
              optionPrice: 0,
            },
          ],
        },
      ],
      productDetailInfo: null,
      mediaList: [
        {
          mediaId: 0,
          imgUploadUrl: null,
          imgUrl: null,
          imgTitle: null,
          imgUuidTitle: null,
          representCheck: null,
        },
      ],
      manufacturer: null,
      madeInOrigin: null,
      consignmentStore: null,
      memo: null,
      status: null,
    },
  ]);

  // 브랜드 조건 리스트
  const [brands, setBrands] = useState([
    {
      brandId: 0,
      brandTitle: null,
      status: null,
      imgUrl: null,
    },
  ]);

  // 라벨 조건 리스트
  const [labels, setLabels] = useState([
    {
      labelId: 0,
      labelTitle: null,
    },
  ]);

  // 연관 카테고리
  const [relatedCategories, setRelatedCategories] = useState([
    {
      categoryId: 0,
      categoryName: null,
    },
  ]);

  // 선택한 카테고리 파라미터 값값
  const { category, categoryId } = useParams();

  // 필터 가격 최소, 최대
  const [values, setValues] = useState([0, 999999999]);

  const handlePriceChange = (priceRange) => {
    console.log("Price range selected:", priceRange);
    // Implement your filtering logic here
  };

  // 필터 가격 범위 변경
  const handleChange = useCallback(
    (newValues) => {
      setValues(newValues);
      handlePriceChange?.(newValues);
    },
    [handlePriceChange]
  );

  // 필터 가격 포맷
  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 필터
  const [filters, setFilters] = useState({
    brands: new Set(),
    labels: new Set(),
    categories: new Set(),
    priceRanges: new Set(),
  });

  // 필터 선택 수정
  const handleFilterChange = (type, id) => {
    const newFilters = { ...filters };
    if (newFilters[type].has(id)) {
      newFilters[type].delete(id);
    } else {
      newFilters[type].add(id);
    }
    setFilters(newFilters);
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
    setSortCondition(1);
    setActiveFilters({ sort: "최신순" });
    setIsDropdownOpen({ sort: false });
    setValues([0, maxPrice]);
  };

  // 페이지
  const [currentPage, setCurrentPage] = useState(1);

  // 총 페이지
  const [totalPages, setTotalPages] = useState(0);

  // 제품들 호출 시 로딩 state
  const [loading, setLoading] = useState(true);

  // 각 페이지 당 제품 노출 갯수
  const itemsPerPage = 20;

  // 페이지 변경 시 동작
  const handlePageChange = (page) => {
    // 변경한 페이지 번호 state 저장
    setCurrentPage(page);
    setLoading(true); // 페이지 로딩 중

    const condition = {
      categoryLevel: category,
      categoryId: categoryId,
      sort: sortCondition,
      page: page,
      startRangePrice: values[0],
      endRangePrice: values[1],
      brands: Array.from(filters["brands"]),
      labels: Array.from(filters["labels"]),
      relatedDownCategorys: Array.from(filters["categories"]),
    };

    try {
      // 페이지 변경 후 적용한 조건들로 API 호출
      getSelectCategoryProducts(condition).then((res) => {
        setTotalPages(
          res.productCount <= itemsPerPage
            ? 1
            : Math.ceil(res.productCount / itemsPerPage)
        ); // 처음 총 페이지 갯수 처리
        setProductCount(res.productCount); // 제품 수량
        setMaxPrice(res.maxPrice); // 제품 최대 가격
        setProducts(res.products); // 제품 데이터들
        setValues([values[0], res.maxPrice]); // 가격 필터 처리
        setLoading(false); // 페이지 로딩 완료 처리
      });
    } catch (error) {
      console.error(error);
    } finally {
      // Scroll to top of product list
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 필터 조건 적용 후 제품 리스트 호출
  const conditionAdmitSearch = () => {
    setLoading(true); // 페이지 로딩 중

    const condition = {
      categoryLevel: category,
      categoryId: categoryId,
      sort: sortCondition,
      page: 1,
      startRangePrice: values[0],
      endRangePrice: values[1],
      brands: Array.from(filters["brands"]),
      labels: Array.from(filters["labels"]),
      relatedDownCategorys: Array.from(filters["categories"]),
    };

    try {
      // 페이지 변경 후 적용한 조건들로 API 호출
      getSelectCategoryProducts(condition).then((res) => {
        setTotalPages(
          res.productCount <= itemsPerPage
            ? 1
            : Math.ceil(res.productCount / itemsPerPage)
        ); // 처음 총 페이지 갯수 처리
        setProductCount(res.productCount); // 제품 수량
        setMaxPrice(res.maxPrice); // 제품 최대 가격
        setProducts(res.products); // 제품 데이터들
        setValues([values[0], res.maxPrice]); // 가격 필터 처리
        setLoading(false); // 페이지 로딩 완료 처리
      });
    } catch (error) {
      console.error(error);
    } finally {
      // Scroll to top of product list
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 정렬 조건 필터 상태값 state
  const [sortCondition, setSortCondition] = useState(1);

  // 정렬 조건 필터에 들어갈 항목들
  const [activeFilters, setActiveFilters] = useState({
    sort: "최신순",
    // category: "all",
    // priceRange: "all",
    // delivery: "all",
  });

  // 정렬 조건 필터 메뉴의 선택 여부 판단 state
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    sort: false,
    // category: false,
    // price: false,
    // delivery: false,
  });

  // 정렬 조건 필터 메뉴 1
  const sortOptions = [
    { value: "최신순", label: "최신순", sortNum: 1 },
    { value: "낮은가격순", label: "낮은가격순", sortNum: 2 },
    { value: "높은가격순", label: "높은가격순", sortNum: 3 },
    { value: "누적판매순", label: "누적판매순", sortNum: 4 },
  ];

  // const categories = [
  //   { value: "all", label: "All Categories" },
  //   { value: "electronics", label: "Electronics" },
  //   { value: "clothing", label: "Clothing" },
  //   { value: "home", label: "Home & Living" },
  //   { value: "beauty", label: "Beauty" },
  // ];

  // const priceRanges = [
  //   { value: "all", label: "All Prices" },
  //   { value: "under50", label: "Under $50" },
  //   { value: "50to100", label: "$50 to $100" },
  //   { value: "100to200", label: "$100 to $200" },
  //   { value: "over200", label: "Over $200" },
  // ];

  // const deliveryOptions = [
  //   { value: "all", label: "All Options" },
  //   { value: "free", label: "Free Delivery" },
  //   { value: "express", label: "Express Delivery" },
  //   { value: "pickup", label: "Store Pickup" },
  // ];

  // 정렬 조건 필터 변경 시 선택된 정렬 조건 필터 반영
  const handleSortChange = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: value,
    };
    setActiveFilters(newFilters);
    setIsDropdownOpen({ ...isDropdownOpen, [filterType]: false });

    let sort = 1;

    switch (value) {
      case "최신순":
        setSortCondition(1);
        sort = 1;
        break;
      case "낮은가격순":
        setSortCondition(2);
        sort = 2;
        break;
      case "높은가격순":
        setSortCondition(3);
        sort = 3;
        break;
      case "누적판매순":
        setSortCondition(4);
        sort = 4;
        break;
    }

    setLoading(true); // 페이지 로딩 중

    const condition = {
      categoryLevel: category,
      categoryId: categoryId,
      sort: sort,
      page: 1,
      startRangePrice: values[0],
      endRangePrice: values[1],
      brands: Array.from(filters["brands"]),
      labels: Array.from(filters["labels"]),
      relatedDownCategorys: Array.from(filters["categories"]),
    };

    try {
      // 페이지 변경 후 적용한 조건들로 API 호출
      getSelectCategoryProducts(condition).then((res) => {
        setTotalPages(
          res.productCount <= itemsPerPage
            ? 1
            : Math.ceil(res.productCount / itemsPerPage)
        ); // 처음 총 페이지 갯수 처리
        setProductCount(res.productCount); // 제품 수량
        setMaxPrice(res.maxPrice); // 제품 최대 가격
        setProducts(res.products); // 제품 데이터들
        setValues([0, res.maxPrice]); // 가격 필터 처리
        setLoading(false); // 페이지 로딩 완료 처리
      });
    } catch (error) {
      console.error(error);
    } finally {
      // Scroll to top of product list
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 정렬 조건 드랍다운 메뉴 각 컨텐츠들을 눌렀을 때 해당 필터 메뉴 선택 여부 isDropdown state 변경
  const toggleDropdown = (dropdown) => {
    setIsDropdownOpen({
      ...Object.keys(isDropdownOpen).reduce(
        (acc, key) => ({
          ...acc,
          [key]: key === dropdown ? !isDropdownOpen[key] : false,
        }),
        {}
      ),
    });
  };

  // 정렬 조건 필터 드랍다운 메뉴
  const FilterDropdown = ({ type, options, activeValue }) => (
    <div className="filter-dropdown-container">
      <button
        className={`filter-button ${isDropdownOpen[type] ? "active" : ""}`}
        onClick={() => toggleDropdown(type)}
      >
        {options.find((opt) => opt.value === activeValue)?.label}
        <svg
          className={`arrow-icon ${isDropdownOpen[type] ? "open" : ""}`}
          width="10"
          height="6"
          viewBox="0 0 10 6"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>
      {isDropdownOpen[type] && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              className={`dropdown-item ${
                activeValue === option.value ? "active" : ""
              }`}
              onClick={() => handleSortChange(type, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // API 중복 호출 확인용 useRef hook
  const apiCallRef = useRef(false);

  // useEffect를 통한 카테고리 제품 리스트 페이지 조건 설정 및 초기 제품 리스트 API 호출
  useEffect(() => {
    // API 호출 여부 체크를 위한 useRef hook의 값이 false 일 경우 초기 필터 조건 적용하여 한번만 API 호출 수행행
    if (apiCallRef.current === false) {
      // 초기 필터 조건
      const condition = {
        categoryLevel: category,
        categoryId: categoryId,
        sort: 1,
        page: 1,
        startRangePrice: 0,
        endRangePrice: 0,
        brands: [null],
        labels: [null],
        relatedDownCategorys: [null],
      };

      // 초기 필터 조건으로 카테고리 제품 리스트 페이지 API 호출 후 각 반환 데이터 state 저장
      getSelectCategoryProducts(condition).then((res) => {
        setLoading(true); // 페이지 로딩 중
        setTotalPages(
          res.productCount <= itemsPerPage
            ? 1
            : Math.ceil(res.productCount / itemsPerPage)
        ); // 처음 총 페이지 갯수 처리
        setProductCount(res.productCount); // 제품 수량
        setMaxPrice(res.maxPrice); // 제품 최대 가격
        setProducts(res.products); // 제품 데이터들
        setBrands(res.brands); // 제품 관련 브랜드들
        setLabels(res.labels); // 제품 관련 라벨들
        setRelatedCategories(res.relatedCategories); // 제품 관련 하위 카테고리들
        setValues([0, res.maxPrice]); // 가격 필터 처리
        setLoading(false); // 페이지 로딩 완료 처리
      });

      // useRef 값을 true 로 바꾸어 API 중복 호출 방지
      apiCallRef.current = true;
    }
  }, [category, categoryId, currentPage, filters]); // <- category, categoryId 파라미터들이 이전과 동일할 경우 중복 호출 되지 않도록 처리

  return (
    <div id="select-category-products">
      <div id="filter-and-category-products">
        <div id="filter-content">
          <div className="filter-container">
            <div className="filter-header">
              <h2>검색 조건</h2>
              <button className="reset-button" onClick={resetFilters}>
                초기화
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
                      onChange={() =>
                        handleFilterChange("brands", brand.brandId)
                      }
                    />
                    <span className="checkbox-text">{brand.brandTitle}</span>
                  </label>
                ))}
              </div>
            </div>

            {labels.length >= 1 ? (
              <div className="filter-section">
                <h3>라벨</h3>
                <div className="checkbox-group">
                  {labels.map((label) => (
                    <label key={label.labelId} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.labels.has(label.labelId)}
                        onChange={() =>
                          handleFilterChange("labels", label.labelId)
                        }
                      />
                      <span className="checkbox-text">{label.labelTitle}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}

            {/* 카테고리 필터 영역 */}
            {relatedCategories.length >= 1 ? (
              <div className="filter-section">
                <h3>카테고리</h3>
                <div className="checkbox-group">
                  {relatedCategories.map((category) => (
                    <label key={category.categoryId} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.categories.has(category.categoryId)}
                        onChange={() =>
                          handleFilterChange("categories", category.categoryId)
                        }
                      />
                      <span className="checkbox-text">
                        {category.categoryName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}

            {/* 가격 필터 영역 */}
            <div className="filter-section">
              <div className="price-range-header">
                <h3>가격</h3>
                <div className="price-inputs">
                  <span className="price-display">
                    {formatPrice(values[0])} - {formatPrice(values[1])}
                  </span>
                </div>
              </div>

              {/* 가격 범위 드래그 영역 */}
              <div className="range-container">
                <Range
                  values={values}
                  step={1000}
                  min={values[0]}
                  max={values[1]}
                  onChange={handleChange}
                  renderTrack={({ props, children }) => (
                    <div
                      className="range-track"
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                    >
                      <div
                        className="range-track-inner"
                        ref={props.ref}
                        style={{
                          background: getTrackBackground({
                            values,
                            colors: ["#e0e0e0", "#e87722", "#e0e0e0"],
                            min: values[0],
                            max: values[1],
                          }),
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  )}
                  renderThumb={({ props, isDragged, index }) => (
                    <div
                      key={"thumb-" + index}
                      {...props}
                      className={`range-thumb ${isDragged ? "dragging" : ""}`}
                    >
                      <div className="thumb-label">
                        {formatPrice(values[index])}
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* 가격 범위 텍스트 영역 */}
              <div className="price-range-footer">
                <div className="price-input-group">
                  <div className="price-group">
                    <input
                      type="number"
                      value={values[0]}
                      onChange={(e) => {
                        const newValue = Number(e.target.value);
                        handleChange([newValue, values[1]]);
                      }}
                      min={values[0]}
                      max={values[1]}
                    />
                  </div>
                  <div className="price-group">
                    <span className="price-separator">-</span>
                  </div>
                  <div className="price-group">
                    <input
                      type="number"
                      value={values[1]}
                      onChange={(e) => {
                        const newValue = Number(e.target.value);
                        handleChange([values[0], newValue]);
                      }}
                      min={values[0]}
                      max={values[1]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 필터 조건 반영 버튼 영역 */}
            <button
              className="apply-button"
              id="apply-button"
              onClick={conditionAdmitSearch}
            >
              Apply
            </button>
          </div>
        </div>

        <div id="products-content">
          {/* 정렬 조건 필터 영역 */}
          <div className="horizontal-filter">
            {/* 정렬 조건 필터 메뉴 영역 */}
            <div className="filter-section">
              <FilterDropdown
                type="sort"
                options={sortOptions}
                activeValue={activeFilters.sort}
              />

              {/* <FilterDropdown
                type="category"
                options={categories}
                activeValue={activeFilters.category}
              />

              <FilterDropdown
                type="price"
                options={priceRanges}
                activeValue={activeFilters.priceRange}
              />

              <FilterDropdown
                type="delivery"
                options={deliveryOptions}
                activeValue={activeFilters.delivery}
              /> */}
            </div>

            {/* 선택된 정렬 필터 메뉴 노출 영역 */}
            <div className="active-filters">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (value !== "all") {
                  const option = [
                    ...sortOptions,
                    {
                      /* ...categories,
                    ...priceRanges,
                    ...deliveryOptions, */
                    },
                  ].find((opt) => opt.value === value);

                  return option ? (
                    <span key={key} className="filter-tag">
                      {option.label}
                      <button
                        onClick={() => handleSortChange(key, "all")}
                        className="remove-filter"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                }
                return null;
              })}
            </div>
          </div>

          {/* 로딩 및 제품 리스트 노출 영역 */}
          <div id="select-category-products-content">
            {loading ? (
              <>
                <div className="content-1 loader">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </>
            ) : (
              <>
                <div id="content-1">
                  {products.map(selectCategoryProductCard)}
                </div>
              </>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              siblingCount={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectCategoryProductsPage;
