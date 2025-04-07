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

  // 처음 제품 상세 페이지 진입 시 해당 제품이 가지고 있는 옵션 및 상세 옵션들을 별도의 state에 추가 관리
  const [existOptionAndDetailOption, setExistOptionAndDetailOption] = useState(
    new Map()
  );

  // 선택한 옵션들이 관리된 state (이후 existOptionAndDetailOption와 비교하여 선택된 옵션인지 확인하기 위한 용도로 쓰일 것임)
  const [selectOptionAndDetailOption, setSelectOptionAndDetailOption] =
    useState(new Map());

  // 제품 상세 페이지 초기 진입 시 초기화
  useEffect(() => {
    setLoading(true);

    if (apiCallRef.current === false) {
      getProductDetail(productId).then((res) => {
        // 제품 상세 데이터 호출
        setProductDetailInfo(res);

        // 만약 제품에 연관된 옵션 정보들이 하나라도 존재할 경우 진입
        if (productDetailInfo.productOptionList.length >= 1) {
          // 어떤 옵션을 가지고 있는지 초기에 저장되어 관리하게 될 Map
          let existOptionMap = new Map();

          // 옵션 정보들을 돌리면서 옵션과 상세 옵션에 대한 정보들을 Map에 저장
          productDetailInfo.productOptionList.forEach((eachOption) => {
            if (eachOption.productDetailOptionList.length >= 1) {
              eachOption.productDetailOptionList.forEach((eachDetailOption) => {
                existOptionMap.set(
                  eachOption.productOptionId,
                  eachDetailOption.detailOptionId
                );
              });

              setExistOptionAndDetailOption(existOptionMap);
            }
          });
        }

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

  // 선택해야할 옵션 전부 선택했는지 확인하기 위한 boolean
  const [allOptionSelectCheck, setAllOptionSelectCheck] = useState(false);

  // 제품 구매 옵션 변경
  const handleOptionChange = (option) => {
    const selectOption = document.getElementById(
      "option-" + option.productOptionId
    );

    const selectOptionData = selectOption.options[selectOption.selectedIndex];
    const selectOptionId = option.productOptionId;
    const selectOptionName = option.productOptionTitle;
    const selectDetailOptionId = selectOptionData.value;
    const selectDetailOptionName = selectOptionData.text;

    console.dir("선택 옵션 id : " + selectOptionId);
    console.dir("선택 옵션 명 : " + selectOptionName);
    console.dir("선택 상세 옵션 id : " + selectDetailOptionId);
    console.dir("선택 상세 옵션 명 : " + selectDetailOptionName);

    // map에 있는 데이터에 덮어씌울 경우
    setSelectOptionAndDetailOption((prev) =>
      new Map(prev).set(selectOptionId, {
        detailOptionId: selectDetailOptionId,
        detailOptionName: selectDetailOptionName,
      })
    );

    let checkSelectOptionAndDetailOption = new Map(selectOptionAndDetailOption);
    checkSelectOptionAndDetailOption.set(selectOptionId, {
      detailOptionId: selectDetailOptionId,
      detailOptionName: selectDetailOptionName,
    });

    let checkAllOptionSelect = false;
    existOptionAndDetailOption.keys().forEach((eachOptionDataKey) => {
      if (checkSelectOptionAndDetailOption.has(eachOptionDataKey)) {
        setAllOptionSelectCheck(true);
        checkAllOptionSelect = true;
      } else {
        setAllOptionSelectCheck(false);
        checkAllOptionSelect = false;
      }
    });

    console.log(existOptionAndDetailOption.keys());
    console.log(existOptionAndDetailOption);
    if (checkAllOptionSelect) {
      console.log("옵션 전부 선택함");
    } else {
      console.log("옵션 전부 선택 못함");
      console.dir(checkSelectOptionAndDetailOption.entries());
    }

    // if (allOptionSelectCheck) {
    //   return (
    //     <div>
    //       {selectOptionAndDetailOption.values().map((eachSelectOptionData) => {
    //         return (
    //           <div>
    //             <p>{eachSelectOptionData.detailOptionId}</p>
    //             <p>{eachSelectOptionData.detailOptionName}</p>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   );
    // } else {
    //   return null;
    // }

    // setSelectedOptions((prev) => ({
    //   ...prev,
    //   [optionId]: detailOptionId,
    // }));
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
        <div className="product-detail-page-header">
          <div className="product-related-category-header">
            <p>
              <a id={"downCategory-" + productDetailInfo.upCategoryId}>
                {productDetailInfo.upCategory}
              </a>
              {"  >  "}
              <a id={"downCategory-" + productDetailInfo.middleCategoryId}>
                {productDetailInfo.middleCategory}
              </a>
              {"  >  "}
              <a id={"downCategory-" + productDetailInfo.downCategoryId}>
                {productDetailInfo.downCategory}
              </a>
            </p>
          </div>
        </div>
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
                  <div className="stars" style={{ "--rating": 4 }}>
                    {" "}
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
                    <div className="option-selects">
                      <select
                        onChange={() => handleOptionChange(option)}
                        defaultValue={"placeholder-option"}
                        name={"option-" + option.productOptionId}
                        id={"option-" + option.productOptionId}
                        className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                      >
                        {option.productDetailOptionList?.map((detailOption) => {
                          if (
                            productDetailInfo.productOptionList.indexOf(
                              option
                            ) === 0
                          ) {
                            return (
                              <>
                                <option
                                  value="placeholder-option"
                                  disabled
                                  hidden
                                >
                                  {option.productOptionTitle}
                                </option>
                                <option
                                  id={
                                    "detailOption-" +
                                    detailOption.detailOptionId
                                  }
                                  value={detailOption.detailOptionId}
                                >
                                  {detailOption.detailOptionName}
                                </option>
                              </>
                            );
                          } else {
                            return (
                              <option
                                id={
                                  "detailOption-" + detailOption.detailOptionId
                                }
                                value={detailOption.detailOptionId}
                              >
                                {detailOption.detailOptionName}
                              </option>
                            );
                          }
                        })}
                      </select>
                    </div>
                  );
                })}
                {allOptionSelectCheck ? (
                  <div>
                    {selectOptionAndDetailOption
                      .values()
                      .map((eachSelectOptionData) => {
                        return (
                          <div>
                            <p>{eachSelectOptionData.detailOptionId}</p>
                            <p>{eachSelectOptionData.detailOptionName}</p>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <></>
                )}
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
                <ul>
                  <li>
                    <span>
                      * 일부 상품의 경우 상품별, 지역별 보유 물량에 따라 배송이
                      지연될 수 있습니다.
                    </span>
                  </li>
                  <li>
                    <span>
                      * 도서산간(제주 포함)의 경우 추가 배송비가 발생하거나 물류
                      사정에 따라 배송이 불가할 수 있습니다.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 하위 제품 상세 정보 컨텐츠 focus 버튼 영역 */}
          <div className="product-focus-button-tabs">
            <div className="focus-button">
              <button>상세정보</button>
            </div>
            <div className="focus-button">
              <button>리뷰</button>
            </div>
            <div className="focus-button">
              <button>Q&A</button>
            </div>
            <div className="focus-button">
              <button>반품/교환정보</button>
            </div>
          </div>

          {/* 제품 상세 정보 이미지 및 내용 노출 영역 */}
          <div
            className="product-details-tabs"
            dangerouslySetInnerHTML={{
              __html: productDetailInfo.productDetailInfo,
            }}
          ></div>

          {/* 리뷰 정보 */}
          <div className="review-info-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
            <div className="review-title">
              <h3>상품리뷰</h3>
            </div>
            <div className="review-explain">
              상품을 구매하신 분들이 작성하신 리뷰입니다. 리뷰 작성시 아래
              금액만큼 포인트가 적립됩니다.
              <dl className="total-explain">
                <dt className="text-explain">텍스트 리뷰 :</dt>
                <dd className="text-explain">50원</dd>
                <dt className="media-explain">포토/동영상 리뷰 :</dt>
                <dd className="media-explain">150원</dd>
                <dt className="one-month-text-explain">
                  한달사용 텍스트 리뷰 :
                </dt>
                <dd className="one-month-text-explain">50원</dd>
                <dt className="one-month-media-explain">
                  한달사용 포토/동영상 리뷰 :
                </dt>
                <dd className="one-month-media-explain">150원</dd>
              </dl>
            </div>
            <div className="review-summary">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="media-review-title">
              <h4>포토&동영상 0건</h4>
            </div>
            <div className="media-review-contents">
              <div className="medias">{/* <img></img> */}</div>
              <div className="medias">{/* <img></img> */}</div>
              <div className="medias">{/* <img></img> */}</div>
              <div className="medias">{/* <img></img> */}</div>
              <div className="medias">{/* <img></img> */}</div>
              <div className="medias">{/* <img></img> */}</div>
              <div className="medias">{/* <img></img> */}</div>
              <div className="medias">{/* <img></img> */}</div>
            </div>
          </div>

          {/* Q&A 정보 */}
          <div className="product-qna-info-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
          </div>

          {/* 반품/교환환 정보 */}
          <div className="recall-info-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
          </div>

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
