import { defaultInstance, authInstance } from "../utils/axiosApiUtil";
import {
  categoryBestProducts,
  newReleaseProducts,
  weeklyBestProducts,
  categorySelectProducts,
} from "../services/product";

// 메인 페이지 Weekly 판매 베스트 제품들 호출 API
export const getWeeklyBestProducts = async () => {
  try {
    const responseData = await authInstance.get("/api/product/weekly/best");

    const weeklyBestProductData = responseData.data.data;
    const weeklyBestProductList = weeklyBestProducts(weeklyBestProductData);

    return weeklyBestProductList;
  } catch (error) {
    console.dir(error);
  }
};

// 메인 페이지 카테고리 베스트 제품들 호출 API
export const getCategoryBestProducts = async (categoryId) => {
  try {
    const products = await authInstance.get(
      "/api/product/category/best?categoryId=" + categoryId
    );

    const productsData = products.data.data;
    const categoryBestProductList = categoryBestProducts(productsData);

    return categoryBestProductList;
  } catch (error) {
    console.dir(error);
  }
};

// 메인 페이지 신 상품 제품들 호출 API
export const getNewReleaseProducts = async () => {
  try {
    const responseData = await authInstance.get("/api/product/newrelease");

    const newReleaseProductsData = responseData.data.data;
    const newReleaseProductList = newReleaseProducts(newReleaseProductsData);

    return newReleaseProductList;
  } catch (error) {
    console.dir(error);
  }
};

// 카테고리 선택 시 이동된 제품 리스트 페이지에 노출할 제품들 호출 API
export const getSelectCategoryProducts = async (condition) => {
  try {
    const responseData = await authInstance.get(
      "/api/product/page/" +
        condition.categoryLevel +
        "/" +
        condition.categoryId +
        "/list?sort=" +
        condition.sort +
        "&page=" +
        condition.page +
        "&startRangePrice=" +
        condition.startRangePrice +
        "&endRangePrice=" +
        condition.endRangePrice +
        "&brandId=" +
        condition.brands +
        "&labels=" +
        condition.labels +
        "&middleCategoryId=" +
        condition.relatedDownCategorys
    );

    const selectCategoryProducts = responseData.data.data;
    const selectCategoryProductList = categorySelectProducts(
      selectCategoryProducts.mainProductList
    );

    const response = {
      productCount: selectCategoryProducts.totalMainProductCount,
      maxPrice: selectCategoryProducts.maxPrice,
      products: selectCategoryProductList,
      brands: selectCategoryProducts.brandList,
      labels: selectCategoryProducts.labelList,
      relatedCategories: selectCategoryProducts.relatedUnderCategoryList,
    };

    return response;
  } catch (error) {
    console.dir(error);
  }
};
