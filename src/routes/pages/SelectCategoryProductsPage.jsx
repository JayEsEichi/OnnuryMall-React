import React, {
  Suspense,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useRef,
  useDeferredValue,
} from "react";
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
  const handlePageChange = async (page) => {
    // 변경한 페이지 번호 state 저장
    setCurrentPage(page);

    // 페이지 변경 후 적용되어있는 조건들
    const condition = {
      categoryLevel: category,
      categoryId: categoryId,
      sort: 1,
      page: page,
      startRangePrice: values[0],
      endRangePrice: values[1],
      brands: Array.from(filters["brands"]),
      labels: Array.from(filters["labels"]),
      relatedDownCategorys: Array.from(filters["categories"]),
    };

    console.dir(condition);

    try {
      // 페이지 변경 후 적용한 조건들로 API 호출
      getSelectCategoryProducts(condition).then((res) => {
        setLoading(true); // 페이지 로딩 중
        setTotalPages(Math.ceil(res.productCount / itemsPerPage)); // 처음 총 페이지 갯수 처리
        setProductCount(res.productCount); // 제품 수량
        setMaxPrice(res.maxPrice); // 제품 최대 가격
        setProducts(res.products); // 제품 데이터들
        setBrands(res.brands); // 제품 관련 브랜드들
        setLabels(res.labels); // 제품 관련 라벨들
        setRelatedCategories(res.relatedCategories); // 제품 관련 하위 카테고리들
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
        setTotalPages(Math.ceil(res.productCount / itemsPerPage)); // 처음 총 페이지 갯수 처리
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
    } else {
      apiCallRef.current = false;
    }
  }, [category, categoryId, currentPage]); // <- category, categoryId 파라미터들이 이전과 동일할 경우 중복 호출 되지 않도록 처리

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

              <div className="range-container">
                <Range
                  values={values}
                  step={10}
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

              <div className="price-range-footer">
                <div className="price-input-group">
                  <input
                    type="number"
                    value={values[0]}
                    onChange={(e) => {
                      const newValue = Math.max(
                        values[0],
                        Number(e.target.value)
                      );
                      handleChange([newValue, values[1]]);
                    }}
                    min={values[0]}
                    max={values[1]}
                  />
                  <span className="price-separator">-</span>
                  <input
                    type="number"
                    value={values[1]}
                    onChange={(e) => {
                      const newValue = Math.min(
                        values[1],
                        Number(e.target.value)
                      );
                      handleChange([values[0], newValue]);
                    }}
                    min={values[0]}
                    max={values[1]}
                  />
                  <button
                    className="apply-button"
                    onClick={() => handleChange?.(values)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="products-content">
          <div id="select-category-products-content">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <>
                <div id="content-1">
                  {products.map(selectCategoryProductCard)}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  siblingCount={1}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectCategoryProductsPage;
