import { defaultInstance, authInstance } from "../utils/axiosApiUtil";
import { mainPageCategorys } from "../services/category";

// 메인 페이지 카테고리 리스트 호출 API
export const getMainPageQuickUpCategory = async () => {
  try {
    const categorys = await authInstance.get("/api/category/mainlist");

    const categorysData = categorys.data.data;
    const mainPageCategoryList = mainPageCategorys(categorysData);

    return mainPageCategoryList;
  } catch (error) {
    console.dir(error);
  }
};

// 메인 페이지 네비게이션 카테고리 데이터 호출 API
export const getNavigationCategory = async () => {
  try {
    const responseData = await authInstance.get("/api/category/navigation");

    const navigationCategories = responseData.data.data;

    return navigationCategories;
  } catch (error) {
    console.dir(error);
  }
};
