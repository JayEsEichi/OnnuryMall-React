import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Swiper
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

// API
import {
  getCategoryBestProducts,
  getNewReleaseProducts,
  getWeeklyBestProducts,
} from "../../apis/api/product";
import { getMainPageBannerList } from "../../apis/api/banner";
import { getMainPageQuickUpCategory } from "../../apis/api/category";
import { getMainPageBrandList } from "../../apis/api/brand";

// Component Contents
import ProductCard from "../../components/Product/ProductCard";
import BannerCard from "../../components/Banner/BannerCard";
import CategoryCard from "../../components/Category/CategoryCard";

// Css
import "../../styles/Home.css";

// Test Image
import testImage4 from "../../assets/slidebannerimage.png";
import allBrandImage from "../../assets/all-brand-image.png";

// 메인 페이지 온누리 몰 Weekly 판매 베스트 제품들 Card
function weeklyBestProductCard(Product) {
  return (
    <SwiperSlide>
      <ProductCard
        key={"c" + Product.productId}
        productId={Product.productId}
        thumbnailImg={Product.mediaList[0].imgUrl}
        brand={Product.brand}
        productType={Product.deliveryType}
        productName={Product.productName}
        sellPrice={Product.sellPrice}
      />
    </SwiperSlide>
  );
}

// 메인 페이지 카테고리 베스트 제품들 Card
function categoryBestProductCard(Product) {
  return (
    <ProductCard
      key={"c" + Product.productId}
      productId={Product.productId}
      thumbnailImg={Product.mediaList[0].imgUrl}
      brand={Product.brand}
      productType={Product.deliveryType}
      productName={Product.productName}
      sellPrice={Product.sellPrice}
    />
  );
}

// 메인 페이지 최상단 배너 Card
function mainPageBannerCard(Banner) {
  return (
    <SwiperSlide>
      <BannerCard
        key={Banner.bannerId}
        bannerId={Banner.bannerId}
        bannerImage={Banner.bannerImages[0].imgUrl}
      />
    </SwiperSlide>
  );
}

// 메인 페이지 카테고리 Card
function mainPageCategoryCard(Category) {
  return (
    <SwiperSlide>
      <CategoryCard
        key={Category.categoryId}
        categoryId={Category.categoryId}
        categoryName={Category.categoryName}
        categoryImage={Category.imgUrl}
      />
    </SwiperSlide>
  );
}

// 메인 페이지 카테고리 BEST 메뉴 버튼 영역
function mainPageCategoryBestButton(Category, categoryProductsCall) {
  return (
    <li className="">
      <NavLink
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={categoryProductsCall}
      >
        <button>{Category.categoryName}</button>
      </NavLink>
    </li>
  );
}

// 메인 페이지 최하단 브랜드 리스트 버튼 영역
function mainPageBrandListButton(Brand) {
  return (
    <div className="brand-list">
      <a href="">
        <div className="brand">
          <div className="brand-image">
            <img src={Brand.mediaUrl}></img>
          </div>
          <p>{Brand.brandTitle}</p>
        </div>
      </a>
    </div>
  );
}

function Home() {
  // Weekly BEST 제품 리스트
  const [weeklyBestProductList, setWeeklyBestProducts] = useState([
    {
      brand: null,
      upCategory: null,
      middleCategory: null,
      downCategory: null,
      productId: 0,
      productName: null,
      classificationCode: null,
      modelNumber: null,
      deliveryType: null,
      deliveryPrice: 0,
      sellClassification: null,
      sellPrice: 0,
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
    },
  ]);

  // 카테고리 BEST 제품 리스트
  const [categoryBestProductList, setCategoryBestProducts] = useState([
    {
      brand: null,
      upCategory: null,
      middleCategory: null,
      downCategory: null,
      productId: 0,
      productName: null,
      classificationCode: null,
      modelNumber: null,
      deliveryType: null,
      deliveryPrice: 0,
      sellClassification: null,
      sellPrice: 0,
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
    },
  ]);

  // 메인 페이지 최상단 메인 배너 리스트 데이터
  const [mainPageBannerList, setMainPageBannerList] = useState([
    {
      bannerId: 0,
      title: null,
      linkUrl: null,
      expressionOrder: 0,
      bannerImages: [
        {
          mediaId: 0,
          imgUploadUrl: null,
          imgUrl: null,
          imgTitle: null,
          imgUuidTitle: null,
          type: null,
          mappingContentId: 0,
        },
      ],
    },
  ]);

  // 메인 페이지 최상단 메인 카테고리 리스트 데이터
  const [mainPageCategoryList, setMainPageCategoryList] = useState([
    {
      categoryId: 0,
      categoryGroup: null,
      motherCode: null,
      classificationCode: null,
      categoryName: null,
      imgUrl: null,
      productCount: 0,
    },
  ]);

  // 메인 페이지 신 상품 제품들 리스트 데이터
  const [newReleaseProductList, setNewReleaseProductList] = useState([
    {
      brand: null,
      upCategory: null,
      middleCategory: null,
      downCategory: null,
      productId: 0,
      productName: null,
      classificationCode: null,
      modelNumber: null,
      deliveryType: null,
      deliveryPrice: 0,
      sellClassification: null,
      sellPrice: 0,
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
    },
  ]);

  // 전체 브랜드 리스트 데이터
  const [brandList, setBrandList] = useState([
    {
      brandId: 0,
      brandTitle: null,
      status: null,
      mediaId: null,
      mediaUrl: null,
    },
  ]);

  // 메인 페이지 노출 맛보기 브랜드 리스트 데이터
  const [expressionBrandList, setExpressionBrandList] = useState([
    {
      brandId: 0,
      brandTitle: null,
      status: null,
      mediaId: null,
      mediaUrl: null,
    },
  ]);

  // 렌더링 시 API 호출 중복 방지용
  const [renderCheck, setRenderCheck] = useState(false);
  const apiCallRef = useRef(false);

  // 렌더링 되기 전에 먼저 실행되는 사이드 이펙트 LayoutEffect
  // useLayoutEffect(() => {
  //   getWeeklyBestProducts().then((res) => setWeeklyBestProducts(res));
  //   getCategoryBestProducts(16).then((res) => setCategoryBestProducts(res));
  //   getMainPageBannerList().then((res) => setMainPageBannerList(res));
  //   getMainPageQuickUpCategory().then((res) => setMainPageCategoryList(res));
  //   getNewReleaseProducts().then((res) => setNewReleaseProductList(res));
  //   getMainPageBrandList().then((res) => {
  //     setBrandList(res);
  //     setExpressionBrandList(res.slice(0, 9));
  //   });
  // }, []);

  // useEffect를 사용하여 렌더링 후 외부 시스템, 라이브러리와 같은 React 에서 제어 불가능한 시스템을 동기화
  // 렌더링에 포함되지 않는 useRef로 boolean 값을 부여하여 처음
  useEffect(() => {
    if (apiCallRef.current === false) {
      getWeeklyBestProducts().then((res) => setWeeklyBestProducts(res));
      getCategoryBestProducts(16).then((res) => setCategoryBestProducts(res));
      getMainPageBannerList().then((res) => setMainPageBannerList(res));
      getMainPageQuickUpCategory().then((res) => setMainPageCategoryList(res));
      getNewReleaseProducts().then((res) => setNewReleaseProductList(res));
      getMainPageBrandList().then((res) => {
        setBrandList(res);
        setExpressionBrandList(res.slice(0, 9));
      });
      apiCallRef.current = true;
    } else {
      apiCallRef.current = false;
    }
  }, []);

  return (
    <div id="home">
      <div id="home-content">
        {/* 최상위 이벤트 배너 영역 */}
        <div id="home-content-1" className="contents">
          <Swiper
            modules={[Navigation]}
            spaceBetween={50}
            slidesPerView={2}
            navigation
          >
            {mainPageBannerList.map((banner) => {
              const bannerCall = (event) => {
                // 이벤트 버블링 방지
                event.preventDefault();
              };
              return mainPageBannerCard(banner);
            })}
          </Swiper>
        </div>

        {/* 카테고리 아이콘 영역 */}
        <div id="home-content-2" className="contents">
          <Swiper
            modules={[Navigation]}
            spaceBetween={50}
            slidesPerView={5}
            navigation
          >
            {mainPageCategoryList.map(mainPageCategoryCard)}
          </Swiper>
        </div>

        {/* 온누리가전몰 BEST 텍스트 영역 */}
        <div id="home-content-3" className="contents">
          <h2>온누리가전몰 BEST</h2>
        </div>

        {/* Weekly BEST 제품 노출 영역 */}
        <div id="home-content-4" className="contents">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={4}
            navigation
          >
            {weeklyBestProductList.map(weeklyBestProductCard)}
          </Swiper>
        </div>

        {/* 배너 1 슬라이드 영역 */}
        <div id="home-content-5" className="contents">
          <Swiper
            modules={[Navigation]}
            spaceBetween={50}
            slidesPerView={2}
            navigation
          >
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* 신상품 텍스트 영역 */}
        <div id="home-content-6" className="contents">
          <h2>신상품</h2>
        </div>

        {/* 신상품 8개 제품들 노출 영역 */}
        <div id="home-content-7" className="contents">
          {newReleaseProductList.map((product) => {
            return (
              <ProductCard
                key={product.productId}
                productId={product.productId}
                thumbnailImg={product.mediaList[0].imgUrl}
                brand={product.brand}
                productType={
                  product.deliveryType === "D" ? "배달 제품" : "설치 제품"
                }
                productName={product.productName}
                sellPrice={product.sellPrice}
              />
            );
          })}
        </div>

        {/* 2차 슬라이드 배너 영역 */}
        <div id="home-content-8" className="contents">
          <Swiper
            modules={[Navigation]}
            spaceBetween={50}
            slidesPerView={2}
            navigation
          >
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-banner-container">
                <img src={testImage4}></img>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* 카테고리 BEST 텍스트 영역 */}
        <div id="home-content-9" className="contents">
          <h2>카테고리 BEST</h2>
        </div>

        {/* 카테고리 버튼 영역 */}
        <div id="home-content-10" className="contents">
          <ul className="d-flex">
            {mainPageCategoryList.map((category) => {
              const categoryProductsCall = (event) => {
                // 이벤트 버블링 방지
                event.preventDefault();

                // 각 카테고리 버튼 클릭 시 카테고리 BEST 제품들 노출 영역 실시간 변경
                getCategoryBestProducts(category.categoryId).then((res) =>
                  setCategoryBestProducts(res)
                );
              };

              return mainPageCategoryBestButton(category, categoryProductsCall);
            })}
          </ul>
        </div>

        {/* 카테고리 제품들 노출 영역 */}
        <div id="home-content-11" className="contents">
          {categoryBestProductList.map(categoryBestProductCard)}
        </div>

        {/* 전체 상품 보기 버튼 영역 */}
        <div id="home-content-12" className="contents">
          <div id="all-product-btn">
            <a href="">
              <button>상품 전체 보기</button>
            </a>
          </div>
        </div>

        {/* 브랜드관 텍스트 영역 */}
        <div id="home-content-13" className="contents">
          <h2>온누리 몰 브랜드관</h2>
        </div>

        {/* 브랜드 리스트 영역 */}
        <div id="home-content-14" className="contents">
          {expressionBrandList.map(mainPageBrandListButton)}
          <div className="brand-list">
            <a href="">
              <div className="brand">
                <div className="brand-image">
                  <img src={allBrandImage} />
                </div>
                <p>전체보기</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
