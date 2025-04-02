import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeaderLayout from "./layouts/CommonHeaderLayout";
import FooterLayout from "./layouts/CommonFooterLayout";
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import SelectCategoryProducts from "./pages/SelectCategoryProductsPage";
import ProductDetail from "./pages/ProductDetailPage";
import Cart from "./pages/CartPage";
import Notice from "./pages/NoticePage";
import Faq from "./pages/FaqPage";
import Inquiry from "./pages/InquiryPage";
import TermsPolicy from "./pages/TermsPolicyPage";
import GalleryDetail from "./pages/GalleryDetail";

// 전체 페이지 라우터 경로 설정 및 호출 페이지 element 등록록
const router = createBrowserRouter([
  {
    element: [<HeaderLayout key="0" />, <FooterLayout key="99" />],
    children: [
      {
        path: "/",
        element: <Home key="1" />,
      },
      {
        path: "/login",
        element: <Login key="2" />,
      },
      {
        path: "/cart",
        element: <Cart key="3" />,
      },
      {
        path: "/notice",
        element: <Notice key="4" />,
      },
      {
        path: "/faq",
        element: <Faq key="5" />,
      },
      {
        path: "/inquiry",
        element: <Inquiry key="6" />,
      },
      {
        path: "/policy",
        element: <TermsPolicy key="7" />,
      },
      {
        path: "/gallery/detail/:contentId",
        element: <GalleryDetail key="8" />,
      },
      {
        path: "/:category/category/:categoryId/products",
        element: <SelectCategoryProducts key="9" />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetail key="10" />,
      },
    ],
  },
]);

// 라우터 제공자에게 페이지 라우터 정보 전달 후 라우터 생성
function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
