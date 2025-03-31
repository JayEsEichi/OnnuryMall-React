// 메인 페이지 카테고리 리스트 데이터 정제
export const mainPageCategorys = (rawData) => {
  return rawData.map(
    ({
      categoryId,
      categoryGroup,
      motherCode,
      classificationCode,
      categoryName,
      imgUrl,
      productCount,
    }) => {
      return {
        categoryId: categoryId,
        categoryGroup: categoryGroup,
        motherCode: motherCode,
        classificationCode: classificationCode,
        categoryName: categoryName,
        imgUrl: imgUrl,
        productCount: productCount,
      };
    }
  );
};
