import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import "../styles/Header.css";
import logoImage from "../assets/onnury_logo.png";
import "remixicon/fonts/remixicon.css";
import { getNavigationCategory } from "../apis/api/category";

// 로그인 / 로그아웃 버튼
function LoginLogoutButton(loginCheck) {
  const localStorage = window.localStorage;
  const sessionStorage = window.sessionStorage;

  const deleteLoginSession = (logoutEvent) => {
    logoutEvent.preventDefault();
    localStorage.removeItem("Authorization");
    localStorage.removeItem("RefreshToken");
    localStorage.removeItem("AccessTokenExpireTime");
    sessionStorage.removeItem("Authorization");
    sessionStorage.removeItem("RefreshToken");
    sessionStorage.removeItem("AccessTokenExpireTime");
    window.location.href = "/";
  };

  if (loginCheck) {
    return (
      <a
        onClick={(e) => {
          deleteLoginSession(e);
        }}
      >
        <i className="ri-user-3-line"> 로그아웃</i>
      </a>
    );
  } else {
    return (
      <a href="/login">
        <i className="ri-user-3-line"> 로그인</i>
      </a>
    );
  }
}

// 소분류 네비게이션 카테고리 토글 메뉴 영역
function DownCategoryToggleMenuButton(Category) {
  return (
    <li>
      <a
        href={"/md/category/" + Category.upCategoryId + "/products"}
        id={Category.downCategoryId}
      >
        {Category.downCategoryName}
      </a>
    </li>
  );
}

// 중분류 네비게이션 카테고리 토글 메뉴 영역
function MiddleCategoryToggleMenuButton(Category) {
  return (
    <li
      id={"li-md-" + Category.middleCategoryId}
      key={"md-" + Category.middleCategoryId}
    >
      <a
        href={"/md/category/" + Category.upCategoryId + "/products"}
        id={Category.middleCategoryId}
      >
        {Category.middleCategoryName}
      </a>
      <div className="hover-menu">
        <ul>
          {Category.relatedDownCategories.map(DownCategoryToggleMenuButton)}
        </ul>
      </div>
    </li>
  );
}

// 대분류 네비게이션 카테고리 토글 메뉴 영역
function TopCategoryToggleMenuButton(Category) {
  return (
    <li
      id={"li-up-" + Category.upCategoryId}
      key={"up-" + Category.upCategoryId}
    >
      <a
        href={"/up/category/" + Category.upCategoryId + "/products"}
        id={Category.upCategoryId}
      >
        {Category.upCategoryName}
      </a>
      <div className="hover-menu" key={"up-" + Category.upCategoryId}>
        <ul>
          {Category.relatedMiddleCategories.map(MiddleCategoryToggleMenuButton)}
        </ul>
      </div>
    </li>
  );
}

// 실질적으로 네비게이션 버튼 눌렀을 때 동작할 부분
function Header() {
  // <a></a> : 페이지 자체를 로드
  // <Link></Link> : 페이지 전체를 로드하지 않고 필요한 부분만 업데이트
  // <NavLink></NavLink> : 현재 경로와 비교하여 active 설정값을 부여하여 활성 상태를 확인하고 업데이트
  const [loginCheck, setLoginCheck] = useState(false);

  // 메인 페이지 최상단 메인 네비게이션 카테고리 리스트 데이터
  const [mainPageCategoryList, setMainPageCategoryList] = useState([
    {
      upCategoryId: 0,
      upCategoryName: null,
      relatedMiddleCategories: [
        {
          middleCategoryId: 0,
          middleCategoryName: null,
          relatedDownCategories: [
            { downCategoryId: 0, downCategoryName: null },
          ],
        },
      ],
      relatedBrands: [
        {
          brandId: 0,
          brandName: null,
        },
      ],
    },
  ]);

  const apiCallRef = useRef(false);

  useEffect(() => {
    // 로그인 세션 유지 혹은 만료 처리
    const localStorage = window.localStorage;
    const sessionStorage = window.sessionStorage;
    if (
      localStorage.getItem("Authorization") !== null ||
      sessionStorage.getItem("Authorization") !== null
    ) {
      setLoginCheck(true);
    } else {
      setLoginCheck(false);
    }

    if (apiCallRef.current === false) {
      // 상단 카테고리 토글 메뉴에 노출할 네비게이션 카테고리 데이터들
      getNavigationCategory().then((res) => setMainPageCategoryList(res));
      apiCallRef.current = true;
    } else {
      apiCallRef.current = false;
    }
  }, []);

  return (
    <header id="header-wrapper">
      <div id="header-content">
        <div id="header-content-1" className="header-container">
          <div id="header-detail-content-1">
            <a className="main-page-btn" href="/">
              <img id="logo_image" src={logoImage}></img>
            </a>
          </div>
          <div id="header-detail-content-2">
            <form id="search-content">
              <input
                type="text"
                id="search-box"
                placeholder="검색할 내용을 입력해주세요."
              />
              <button id="search-btn-wrapper">
                <a className="search-btn" href="/page/test">
                  <i className="ri-search-line"></i>
                </a>
              </button>
            </form>
          </div>
          <div id="header-detail-content-3" className="personal-header-content">
            <div className="personal-header-content">
              <LoginLogoutButton key={loginCheck} loginCheck={loginCheck} />
            </div>
            <div className="personal-header-content">
              <a href="/cart">
                <i className="ri-shopping-cart-line"> 장바구니</i>
              </a>
            </div>
            <div className="personal-header-content">
              <a>
                <i className="ri-eye-line"> 최근 본 제품</i>
              </a>
            </div>
          </div>
        </div>
        <div id="header-content-2" className="header-container">
          <div id="header-detail-content-2">
            <div id="detail-content-1">
              <i className="ri-menu-2-line"></i>
              <span>모든 카테고리</span>
              <div className="menu-container">
                <ul className="vertical-nav">
                  {mainPageCategoryList.map(TopCategoryToggleMenuButton)}
                </ul>
              </div>
            </div>
            <div id="detail-content-2">
              <div>
                <a href="/notice">공지사항</a>
              </div>
              <div>
                <a href="/faq">FAQ</a>
              </div>
              <div>
                <a href="/inquiry">문의하기</a>
              </div>
            </div>
            <div id="detail-content-3">
              <span>고객센터 02-0000-3333</span>
            </div>
          </div>
        </div>
      </div>
      {/* <nav>
                {navigationActiveStyle.map(eachNav => (
                    <NavLink 
                        key={eachNav.id} 
                        to={eachNav.to} 
                        className={({ isActive }) => (isActive ? 'active' : '')}>
                        {eachNav.label}
                    </NavLink>
                ))}
            </nav> */}
    </header>
  );
}

export default Header;
