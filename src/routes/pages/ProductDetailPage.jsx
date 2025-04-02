import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

// API
import { getProductDetail } from "../../apis/api/product";

// CSS
import "../../styles/ProductDetail.css";

function ProductDetailPage() {
  // 제품 id
  const { productId } = useParams();

  // 제품 상세 정보 데이터
  const [productDetailInfo, setProductDetailInfo] = useState({
    supplierId: 0,
    supplierCompany: null,
    businessNumber: null,
    frcNumber: null,
    represent: null,
    address: null,
    recallAddress: null,
    tel: null,
    csCall: null,
    csInfo: null,
    personInCharge: null,
    contactCall: null,
    email: null,
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
    normalPrice: 0,
    sellPrice: 0,
    eventStartDate: null,
    eventEndDate: null,
    eventDescription: null,
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
    productDetailInfoImages: [
      {
        productDetailImageId: 0,
        type: null,
        imgUrl: null,
      },
    ],
    manufacturer: null,
    madeInOrigin: null,
    consignmentStore: null,
    memo: null,
  });

  // 처음 제품 상세 페이지 진입 시 상세 데이터 API 호출 중복 처리 제어를 위한 ref
  const apiCallRef = useRef(false);

  // 제품 상세 페이지 초기 진입 시 초기화
  useEffect(() => {
    setLoading(true);

    if (apiCallRef.current === false) {
      getProductDetail(productId).then((res) => {
        setProductDetailInfo(res);
        setLoading(false);
      });

      apiCallRef.current = true;
    }
  }, [productId]);

  // 제품 구매 수량 state
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // 선택 제품 옵션 state
  const [selectedOptions, setSelectedOptions] = useState({});

  // 페이지 로딩 state
  const [loading, setLoading] = useState(false);

  // 제품 구매 수량 변경
  const handleQuantityChange = (value) => {
    setSelectedQuantity(Math.max(1, value));
  };

  // 제품 구매 옵션 변경
  const handleOptionChange = (detailOptionId, detailOptionName, valueId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [detailOptionId]: valueId,
    }));
  };

  // 제품 총 구매 가격 계산
  const calculateTotalPrice = () => {
    if (!productDetailInfo) return 0;
    let total = productDetailInfo.sellPrice * selectedQuantity;

    Object.entries(selectedOptions).forEach(([detailOptionId, valueId]) => {
      productDetailInfo.productOptionList.forEach((option) => {
        option.productDetailOptionList.forEach((detailOption) => {
          if (
            detailOption.detailOptionId === detailOptionId &&
            detailOption.optionPrice !== 0
          ) {
            total += detailOption.optionPrice * selectedQuantity;
          }
        });
      });
    });

    return total;
  };

  // 제품 장바구니 담기
  const handleAddToCart = () => {
    const cartItem = {
      productId,
      quantity: selectedQuantity,
      options: selectedOptions,
      totalPrice: calculateTotalPrice(),
    };
    console.log("Adding to cart:", cartItem);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div id="all-product-detail">
      <div id="product-detail-content">
        <div className="product-detail-page">
          <div className="product-detail-container">
            {/* 제품 이미지 영역 */}
            <div className="product-gallery-section">
              {/* <ImageGallery images={product.images} /> */}
              <img
                id="thumbnail-image"
                src={productDetailInfo.mediaList[0].imgUrl}
              ></img>
              <div id="not-thumbnail-images">
                {productDetailInfo.mediaList.length > 1 &&
                  productDetailInfo.mediaList
                    .slice(1, productDetailInfo.mediaList.length)
                    .map((productImage) => {
                      return <img src={productImage.imgUrl}></img>;
                    })}
              </div>
            </div>

            {/* 대표적 제품 내용 노출 영역 */}
            <div className="product-info-section">
              <div className="product-header">
                {/* 제품 명 영역 */}
                <h1 className="product-title">
                  {productDetailInfo.productName}
                </h1>
                <div className="product-meta">
                  {/* 제품 브랜드 영역 */}
                  <span className="product-brand">
                    {productDetailInfo.brand}
                  </span>
                  {/* 제품 모델 명 영역 */}
                  <span className="product-model">
                    모델 : {productDetailInfo.modelNumber}
                  </span>
                </div>
                <div className="product-rating">
                  {/* 제품 별점 영역 */}
                  {/* <div className="stars" style={{ "--rating": product.rating }}>
                    ★★★★★
                  </div> */}
                  <div className="stars" style={{ "--rating": 4 }}>
                    ★★★★★
                  </div>
                  {/* 제품 리뷰 카운트 수 영역 */}
                  {/* <span className="review-count">
                    ({product.reviewCount} Reviews)
                  </span> */}
                  <span className="review-count">(10+ 리뷰)</span>
                </div>
              </div>

              {/* 제품 가격 노출 영역 */}
              <div className="product-price-section">
                <div className="price-container">
                  <span className="current-price">
                    {productDetailInfo.sellPrice.toLocaleString()} 원
                  </span>
                  {productDetailInfo.normalPrice >
                    productDetailInfo.sellPrice && (
                    <span className="original-price">
                      {productDetailInfo.normalPrice.toLocaleString()} 원
                    </span>
                  )}
                </div>

                {/* 제품 할인 가격 노출 영역 */}
                {/* {product.discountPercentage > 0 && (
                  <span className="discount-badge">
                    {product.discountPercentage}% OFF
                  </span>
                )} */}
              </div>

              {/* 제품 구매 옵션 선택 영역 */}
              <div className="product-options">
                {productDetailInfo.productOptionList?.map((option) => {
                  return (
                    <div id="option-list">
                      <p>옵션 id : {option.productOptionId}</p>
                      <p>옵션 명 : {option.productOptionTitle}</p>
                      {option.productDetailOptionList?.map((detailOption) => {
                        return (
                          <div
                            key={"detailOption-" + detailOption.detailOptionId}
                            id={"detailOption-" + detailOption.detailOptionId}
                            onChange={(valueId) =>
                              handleOptionChange(
                                detailOption.detailOptionId,
                                detailOption.detailOptionName,
                                valueId
                              )
                            }
                          >
                            <p>상세 옵션 id : {detailOption.detailOptionId}</p>
                            <p>
                              상세 옵션 명 : {detailOption.detailOptionName}
                            </p>
                            <p>상세 옵션 가격 : {detailOption.optionPrice}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                {/* {product.options?.map((option) => ({
                  <ProductOptions
                    key={option.id}
                    option={option}
                    selectedValue={selectedOptions[option.id]}
                    onChange={(valueId) =>
                      handleOptionChange(option.id, valueId)
                    }
                  />
                }))} */}
              </div>

              {/* 제품 수량 변경 영역 */}
              <div className="quantity-selector">
                <label>수량 : </label>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(selectedQuantity - 1)}
                    disabled={selectedQuantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={selectedQuantity}
                    onChange={(e) =>
                      handleQuantityChange(Number(e.target.value))
                    }
                    min="1"
                    max={99}
                  />
                  <button
                    onClick={() => handleQuantityChange(selectedQuantity + 1)}
                    disabled={selectedQuantity >= 99}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="total-price">
                총 금액 : {calculateTotalPrice().toLocaleString()} 원
              </div>

              {/* 제품 장바구니 담기 영역 */}
              <div className="product-actions">
                {/* <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                >
                  {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button> */}
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  {"장바구니 담기"}
                </button>
                <button className="buy-now-button">구매</button>
              </div>

              <div className="memo-info">
                {/* {productDetailInfo.memo} */}
                {/* <div className="delivery-option">
                  <i className="icon-truck"></i>
                  <div className="delivery-text">
                    <span>Free Delivery</span>
                    <p>Estimated delivery: 2-4 business days</p>
                  </div>
                </div>
                <div className="delivery-option">
                  <i className="icon-return"></i>
                  <div className="delivery-text">
                    <span>Easy Returns</span>
                    <p>30-day return policy</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* 제품 상세 정보 이미지 및 내용 노출 영역 */}
          <div
            className="product-details-tabs"
            dangerouslySetInnerHTML={{
              __html: productDetailInfo.productDetailInfo,
            }}
          ></div>

          {/* 판매자 정보 */}
          <div className="seller-info-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
          </div>

          {/* 유의사항 */}
          <div className="warning-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
          </div>

          {/* 연관 카테고리 제품 리스트 노출 영역 */}
          <div className="related-category-products-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
          </div>

          {/* 연관 브랜드 제품 리스트 노출 영역 */}
          <div className="related-brand-products-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
