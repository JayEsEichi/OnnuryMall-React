import { defaultInstance, authInstance } from "../utils/axiosApiUtil";
import { brand } from "../services/brand";

// 메인 페이지 최하단 브랜드 리스트 호출 API
export const getMainPageBrandList = async () => {
  try {
    const responseData = await authInstance.get("/api/brand/mainlist");

    const brands = responseData.data.data;
    const brandList = brand(brands);

    return brandList;
  } catch (error) {
    console.dir(error);
  }
};
