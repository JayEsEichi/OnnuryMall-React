import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
// API
import { getProductDetail } from "../../apis/api/product";

// CSS
import "../../styles/ProductDetail.css";

// Components
import Review from "../../components/Review/Review";
import ProductCard from "../../components/Product/ProductCard";
import QnaToggleMenu from "../../components/ToggleMenu/QnaToggleMenu";

// Test Images
import testProductThumbImgae from "../../assets/electronic-product.png";

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

  const speechImage = "../../assets/speech.png";

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

          {/* 연관 카테고리 제품 리스트 노출 영역 */}
          <div className="related-category-products-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
            <div id="related-category-products-section-title">
              <h3>
                <strong>연관 카테고리 제품</strong>
              </h3>
            </div>
            <div id="related-category-products">
              <ProductCard
                key={1}
                productId={1}
                thumbnailImg={testProductThumbImgae}
                brand={"삼성"}
                productType={"D"}
                productName={"전자제품 A"}
                sellPrice={250000}
                style={{ padding: "20px" }}
              />
              <ProductCard
                key={2}
                productId={2}
                thumbnailImg={testProductThumbImgae}
                brand={"LG"}
                productType={"D"}
                productName={"전자제품 B"}
                sellPrice={250000}
              />
              <ProductCard
                key={3}
                productId={3}
                thumbnailImg={testProductThumbImgae}
                brand={"신일"}
                productType={"S"}
                productName={"전자제품 C"}
                sellPrice={250000}
              />
              <ProductCard
                key={4}
                productId={4}
                thumbnailImg={testProductThumbImgae}
                brand={"삼성"}
                productType={"D"}
                productName={"전자제품 D"}
                sellPrice={250000}
              />
              <ProductCard
                key={5}
                productId={5}
                thumbnailImg={testProductThumbImgae}
                brand={"삼성"}
                productType={"S"}
                productName={"전자제품 E"}
                sellPrice={250000}
              />
            </div>
          </div>

          {/* 연관 브랜드 제품 리스트 노출 영역 */}
          <div className="related-brand-products-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
            <div id="related-brand-products-section-title">
              <h3>
                <strong>연관 브랜드 제품</strong>
              </h3>
            </div>
            <div id="related-brand-products">
              <ProductCard
                key={1}
                productId={1}
                thumbnailImg={testProductThumbImgae}
                brand={"삼성"}
                productType={"D"}
                productName={"전자제품 A"}
                sellPrice={250000}
              />
              <ProductCard
                key={2}
                productId={2}
                thumbnailImg={testProductThumbImgae}
                brand={"LG"}
                productType={"D"}
                productName={"전자제품 B"}
                sellPrice={250000}
              />
              <ProductCard
                key={3}
                productId={3}
                thumbnailImg={testProductThumbImgae}
                brand={"신일"}
                productType={"S"}
                productName={"전자제품 C"}
                sellPrice={250000}
              />
              <ProductCard
                key={4}
                productId={4}
                thumbnailImg={testProductThumbImgae}
                brand={"삼성"}
                productType={"D"}
                productName={"전자제품 D"}
                sellPrice={250000}
              />
              <ProductCard
                key={5}
                productId={5}
                thumbnailImg={testProductThumbImgae}
                brand={"삼성"}
                productType={"S"}
                productName={"전자제품 E"}
                sellPrice={250000}
              />
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
            <div className="review-title">
              <h3>
                <strong>상품리뷰</strong>
              </h3>
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
              <div>
                <p>사용자 총 평점</p>
                <div className="stars" style={{ "--rating": 4 }}></div>
                <p>최근 6개월 {"5.0"}</p>
                <p>5.0 / 5.0</p>
              </div>
              <div>
                <p>전체 리뷰 수</p>
                <img src={speechImage}></img>
                <p>39</p>
              </div>
              <div>
                <p>평점 비율</p>
              </div>
              <div>
                <p>다른 구매자 평</p>
              </div>
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
            <div className="real-review-contents">
              <div id="real-review-header-title">
                <strong id="review-count">리뷰 39건</strong>
                <ul id="review-sort">
                  <li className="sort-menu">
                    <a>{" 랭킹순 "}</a>
                  </li>
                  <li className="sort-menu">
                    <a>{" 최신순 "}</a>
                  </li>
                  <li className="sort-menu">
                    <a>{" 평점 높은순 "}</a>
                  </li>
                  <li className="sort-menu">
                    <a>{" 평점 낮은순 "}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <Review
                key={1}
                profileImage={"../../assets/default-profile.png"}
                reviewStarRateCount={5}
                nickname={"진세훈"}
                createdAt={"25.04.08"}
                productInfo={"청소기 - 10인치 - 블랙 컬러"}
                reviewTitle={"배송 잘 받았습니다~~"}
                reviewContent={"사용하기 좋고 색깔도 이쁘네요. 마음에 듭니다~~"}
                reviewImage={"../../assets/electronic-product.png"}
              />
              <Review
                key={2}
                profileImage={"../../assets/default-profile.png"}
                reviewStarRateCount={5}
                nickname={"진세훈"}
                createdAt={"25.04.08"}
                productInfo={"청소기 - 10인치 - 블랙 컬러"}
                reviewTitle={"배송 잘 받았습니다~~"}
                reviewContent={"사용하기 좋고 색깔도 이쁘네요. 마음에 듭니다~~"}
                reviewImage={"../../assets/electronic-product.png"}
              />
              <Review
                key={3}
                profileImage={"../../assets/default-profile.png"}
                reviewStarRateCount={5}
                nickname={"진세훈"}
                createdAt={"25.04.08"}
                productInfo={"청소기 - 10인치 - 블랙 컬러"}
                reviewTitle={"배송 잘 받았습니다~~"}
                reviewContent={"사용하기 좋고 색깔도 이쁘네요. 마음에 듭니다~~"}
                reviewImage={"../../assets/electronic-product.png"}
              />
            </div>
            <div></div>
          </div>

          {/* Q&A 정보 */}
          <div className="product-qna-info-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
            <div className="product-qna-info-header">
              <h3>
                <strong>Q&A정보</strong>
              </h3>
              <p className="bd_7zg8i">
                구매하시려는 상품에 대해 궁금한 점이 있으신 경우 문의해주세요.{" "}
                <a
                  href="#"
                  className="bd_29bbw _nlog_click"
                  data-shp-page-key="100356693"
                  data-shp-sti=""
                  data-shp-nsc="brandstore.end"
                  data-shp-inventory="qna"
                  data-shp-area="qna.talk"
                  data-shp-area-type="action"
                  data-shp-area-id="talk"
                >
                  '판매자 톡톡문의'
                </a>
                를 통해 판매자와 간편하게 1:1 상담도 가능합니다.
              </p>
              <div className="qna-btn-collection">
                <div className="collection-1">
                  <button className="qna-btn" id="product-qna-write-btn">
                    제품 Q&A 작성하기
                  </button>
                  <button className="qna-btn" id="show-my-product-qna-btn">
                    {"나의 Q&A 조회 >"}
                  </button>
                </div>
                <div className="collection-2">
                  <ul className="qna-condition">
                    <li>
                      <label className="container">
                        <input type="checkbox" defaultChecked={false} />
                        <div className="checkmark"></div>
                      </label>
                      비밀글 제외
                    </li>
                    <li>
                      내 Q&A보기
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider">
                          <svg
                            className="slider-icon"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="presentation"
                          >
                            <path fill="none" d="m4 16.5 8 8 16-16"></path>
                          </svg>
                        </span>
                      </label>
                    </li>
                    <li>
                      <QnaToggleMenu />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="product-qna-info-section-contents">
              <div className="product-qna-info-list-title">
                <div className="qna-answer-status">
                  <span>답변상태</span>
                </div>
                <div className="qna-title">
                  <span>제목</span>
                </div>
                <div className="qna-writer-name">
                  <span>작성자</span>
                </div>
                <div className="qna-write-date">
                  <span>작성일</span>
                </div>
              </div>
              <ul className="product-qna-info-list">
                <li className="product-qna-info-content">
                  <div>답변완료</div>
                  <a>언제 재입고 되나요?</a>
                  <div>nick****</div>
                  <div>2025.04.09</div>
                </li>
                <li className="product-qna-info-content">
                  <div>답변완료</div>
                  <a>언제 망하나요?</a>
                  <div>pos****</div>
                  <div>2025.04.09</div>
                </li>
                <li className="product-qna-info-content">
                  <div>답변대기</div>
                  <a>환불 가능한가요?</a>
                  <div>ddv****</div>
                  <div>2025.04.09</div>
                </li>
                <li className="product-qna-info-content">
                  <div>답변대기</div>
                  <a>사이즈는 동일한가요?</a>
                  <div>npo****</div>
                  <div>2025.04.09</div>
                </li>
              </ul>
            </div>
          </div>

          {/* 반품/교환 정보 */}
          <div className="recall-info-section">
            <div className="recall-info-title">
              <h2>
                <strong>반품/교환정보</strong>
              </h2>
            </div>
            <div className="recall-info-section-contents">
              <div className="recall-change-notice-header">
                <h4>
                  <strong>제품 반품/교환 안내</strong>
                </h4>
                <span>
                  반품 시 먼저 판매자와 연락하셔서 반품사유, 택배사, 배송비,
                  반품지 주소 등을 협의하신 후 반품상품을 발송해 주시기
                  바랍니다.
                </span>
              </div>
              <div className="recall-change-notice-contents">
                <tbody className="recall-change-table">
                  <tr>
                    <th>
                      <span>판매자 지정택배사</span>
                    </th>
                    <td colSpan={3}>
                      <span>CJ대한통운</span>
                    </td>
                  </tr>
                  <tr>
                    <th>반품배송비</th>
                    <td>
                      반품안심케어에 가입된 상품으로 반품 배송비 무료 <br />
                      (구매확정 이후 구매취소 시 무료반품/교환 제공불가.
                      도서산간비 별도 부과)
                    </td>
                    <th>교환배송비</th>
                    <td>
                      반품안심케어에 가입된 상품으로 교환 배송비 무료 <br />
                      (구매확정 이후 구매취소 시 무료반품/교환 제공불가.
                      도서산간비 별도 부과)
                    </td>
                  </tr>
                  <tr>
                    <th>보내실 곳</th>
                    <td colSpan={3}>
                      경기도 이천시 부발읍 황무로 2037-37 로지스벨리 (우 :
                      17405)
                    </td>
                  </tr>
                  <tr>
                    <th rowSpan={2}>
                      반품/교환 사유에 <br />
                      따른 요청 가능 기간
                    </th>
                    <td colSpan={3}>
                      구매자 단순 변심은 상품 수령 후 7일 이내 (구매자
                      반품배송비 부담)
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      표시/광고와 상이, 계약 내용과 다르게 이행된 경우 상품 수령
                      후 3개월 이내 혹은 표시/광고와 다른 사실을 안 날로부터
                      30일 이내 (판매자 반품 배송비 부담) 둘 중 하나 경과 시
                      반품/교환 불가
                    </td>
                  </tr>
                  <tr>
                    <th>반품/교환 불가능 사유</th>
                    <td colSpan={3}>
                      <ul>
                        <li>1. 반품요청기간이 지난 경우</li>
                        <li>
                          2. 구매자의 책임 있는 사유로 상품 등이 멸실 또는
                          훼손된 경우 (단, 상품의 내용을 확인하기 위하여 포장
                          등을 훼손한 경우는 제외)
                        </li>
                        <li>
                          3. 구매자의 책임있는 사유로 포장이 훼손되어 상품
                          가치가 현저히 상실된 경우 (예: 식품, 화장품, 향수류,
                          음반 등)
                        </li>
                        <li>
                          4. 구매자의 사용 또는 일부 소비에 의하여 상품의 가치가
                          현저히 감소한 경우 (라벨이 떨어진 의류 또는 태그가
                          떨어진 명품관 상품인 경우)
                        </li>
                        <li>
                          5. 시간의 경과에 의하여 재판매가 곤란할 정도로 상품
                          등의 가치가 현저히 감소한 경우
                        </li>
                        <li>
                          6. 고객의 요청사항에 맞춰 제작에 들어가는
                          맞춤제작상품의 경우 (판매자에게 회복불가능한 손해가
                          예상되고, 그러한 예정으로 청약철회권 행사가 불가하다는
                          사실을 서면 동의 받은 경우)
                        </li>
                        <li>
                          7. 복제가 가능한 상품 등의 포장을 훼손한 경우
                          (CD/DVD/GAME/도서의 경우 포장 개봉 시)
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </div>
            </div>
          </div>

          {/* 판매자 정보 */}
          <div className="seller-info-section">
            <div className="seller-info-header">
              <h3>
                <strong>판매자정보</strong>
              </h3>
            </div>
            <div className="seller-info-section-contents">
              <tbody>
                <tr>
                  <th colSpan={2}>상호명</th>
                  <td colSpan={4}>주식회사 SEHUN DEVELOPER</td>
                  <th colSpan={1}>대표자</th>
                  <td colSpan={1}>진세훈</td>
                </tr>
              </tbody>
            </div>
          </div>

          {/* 유의사항 */}
          <div className="warning-section">
            {/* <RelatedProducts categoryId={product.categoryId} /> */}
            <div className="warning-title">
              <h3>
                <strong>유의사항</strong>
              </h3>
            </div>
            <div className="warning-section-contents"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
