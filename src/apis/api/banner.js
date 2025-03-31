import { defaultInstance, authInstance } from "../utils/axiosApiUtil";
import { mainPageBanners } from "../services/banner";

// 메인 페이지 최상단 메인 베너 리스트 호출 API
export const getMainPageBannerList = async () => {
  try {
    const banners = await authInstance.get("/api/banner/mainlist");

    const bannersData = banners.data.data.bannerList;
    const mainPageBannerList = mainPageBanners(bannersData);

    return mainPageBannerList;
  } catch (error) {
    console.dir(error);
  }
};
