// 메인 페이지 최상단 배너 리스트 데이터 정제
export const mainPageBanners = (rawData) => {
  return rawData.map(
    ({ bannerId, title, linkUrl, expressionOrder, bannerImages }) => {
      return {
        bannerId: bannerId,
        title: title,
        linkUrl: linkUrl,
        expressionOrder: expressionOrder,
        bannerImages: bannerImages,
      };
    }
  );
};
