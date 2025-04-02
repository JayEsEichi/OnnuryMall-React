// 메인 페이지 Weekly 베스트트 제품 데이터 정제
export const weeklyBestProducts = (rawData) => {
  return rawData.map(
    ({
      supplierId,
      brandId,
      brand,
      upCategoryId,
      upCategory,
      middleCategoryId,
      middleCategory,
      downCategoryId,
      downCategory,
      productId,
      productName,
      classificationCode,
      labelList,
      modelNumber,
      deliveryType,
      deliveryPrice,
      sellClassification,
      expressionCheck,
      sellPrice,
      normalPrice,
      eventStartDate,
      eventEndDate,
      eventDescription,
      optionCheck,
      productOptionList,
      mediaList,
      manufacturer,
      madeInOrigin,
      consignmentStore,
      memo,
      status,
    }) => {
      return {
        brand: brand,
        upCategory: upCategory,
        middleCategory: middleCategory,
        downCategory: downCategory,
        productId: productId,
        productName: productName,
        classificationCode: classificationCode,
        modelNumber: modelNumber,
        deliveryType: deliveryType,
        deliveryPrice: deliveryPrice,
        sellClassification: sellClassification,
        sellPrice: sellPrice,
        productOptionList: productOptionList,
        mediaList: mediaList,
        manufacturer: manufacturer,
        madeInOrigin: madeInOrigin,
        consignmentStore: consignmentStore,
      };
    }
  );
};

// 메인 페이지 카테고리 BEST 제품 데이터 정제
export const categoryBestProducts = (rawData) => {
  return rawData.map(
    ({
      supplierId,
      brandId,
      brand,
      upCategoryId,
      upCategory,
      middleCategoryId,
      middleCategory,
      downCategoryId,
      downCategory,
      productId,
      productName,
      classificationCode,
      labelList,
      modelNumber,
      deliveryType,
      deliveryPrice,
      sellClassification,
      expressionCheck,
      sellPrice,
      normalPrice,
      eventStartDate,
      eventEndDate,
      eventDescription,
      optionCheck,
      productOptionList,
      mediaList,
      manufacturer,
      madeInOrigin,
      consignmentStore,
      memo,
      status,
    }) => {
      return {
        brand: brand,
        upCategory: upCategory,
        middleCategory: middleCategory,
        downCategory: downCategory,
        productId: productId,
        productName: productName,
        classificationCode: classificationCode,
        modelNumber: modelNumber,
        deliveryType: deliveryType,
        deliveryPrice: deliveryPrice,
        sellClassification: sellClassification,
        sellPrice: sellPrice,
        productOptionList: productOptionList,
        mediaList: mediaList,
        manufacturer: manufacturer,
        madeInOrigin: madeInOrigin,
        consignmentStore: consignmentStore,
      };
    }
  );
};

// 메인 페이지 신 상품 제품 데이터 정제
export const newReleaseProducts = (rawData) => {
  return rawData.map(
    ({
      supplierId,
      brandId,
      brand,
      upCategoryId,
      upCategory,
      middleCategoryId,
      middleCategory,
      downCategoryId,
      downCategory,
      productId,
      productName,
      classificationCode,
      labelList,
      modelNumber,
      deliveryType,
      sellClassification,
      expressionCheck,
      normalPrice,
      sellPrice,
      deliveryPrice,
      purchasePrice,
      eventStartDate,
      eventEndDate,
      eventDescription,
      optionCheck,
      productOptionList,
      productDetailInfo,
      mediaList,
      manufacturer,
      madeInOrigin,
      consignmentStore,
      memo,
      status,
    }) => {
      return {
        brand: brand,
        upCategory: upCategory,
        middleCategory: middleCategory,
        downCategory: downCategory,
        productId: productId,
        productName: productName,
        classificationCode: classificationCode,
        modelNumber: modelNumber,
        deliveryType: deliveryType,
        deliveryPrice: deliveryPrice,
        sellClassification: sellClassification,
        sellPrice: sellPrice,
        productOptionList: productOptionList,
        mediaList: mediaList,
        manufacturer: manufacturer,
        madeInOrigin: madeInOrigin,
        consignmentStore: consignmentStore,
      };
    }
  );
};

// 대분류, 중분류, 소분류 카테고리 선택 시 호출되는 제품 리스트 데이터 정제
export const categorySelectProducts = (rawData) => {
  return rawData.map(
    ({
      supplierId,
      brandId,
      brand,
      upCategoryId,
      upCategory,
      middleCategoryId,
      middleCategory,
      downCategoryId,
      downCategory,
      productId,
      productName,
      classificationCode,
      labelList,
      modelNumber,
      deliveryType,
      sellClassification,
      expressionCheck,
      normalPrice,
      sellPrice,
      deliveryPrice,
      purchasePrice,
      eventStartDate,
      eventEndDate,
      eventDescription,
      optionCheck,
      productOptionList,
      productDetailInfo,
      mediaList,
      manufacturer,
      madeInOrigin,
      consignmentStore,
      memo,
      status,
    }) => {
      return {
        supplierId: supplierId,
        brandId: brandId,
        brand: brand,
        upCategoryId: upCategoryId,
        upCategory: upCategory,
        middleCategoryId: middleCategoryId,
        middleCategory: middleCategory,
        downCategoryId: downCategoryId,
        downCategory: downCategory,
        productId: productId,
        productName: productName,
        classificationCode: classificationCode,
        labelList: labelList,
        modelNumber: modelNumber,
        deliveryType: deliveryType,
        normalPrice: normalPrice,
        sellPrice: sellPrice,
        deliveryPrice: deliveryPrice,
        purchasePrice: purchasePrice,
        eventStartDate: eventStartDate,
        eventEndDate: eventEndDate,
        eventDescription: eventDescription,
        mediaList: mediaList,
      };
    }
  );
};

// 제품 상세 데이터 정제
export const productDetailInfo = (rawData) => {
  return {
    supplierId: rawData.supplierId,
    supplierCompany: rawData.supplierCompany,
    businessNumber: rawData.businessNumber,
    frcNumber: rawData.frcNumber,
    represent: rawData.represent,
    address: rawData.address,
    recallAddress: rawData.recallAddress,
    tel: rawData.tel,
    csCall: rawData.csCall,
    csInfo: rawData.csInfo,
    personInCharge: rawData.personInCharge,
    contactCall: rawData.contactCall,
    email: rawData.email,
    brandId: rawData.brandId,
    brand: rawData.brand,
    upCategoryId: rawData.upCategoryId,
    upCategory: rawData.upCategory,
    middleCategoryId: rawData.middleCategoryId,
    middleCategory: rawData.middleCategory,
    downCategoryId: rawData.downCategoryId,
    downCategory: rawData.downCategory,
    productId: rawData.productId,
    productName: rawData.productName,
    classificationCode: rawData.classificationCode,
    labelList: rawData.labelList,
    modelNumber: rawData.modelNumber,
    deliveryType: rawData.deliveryType,
    sellClassification: rawData.sellClassification,
    normalPrice: rawData.normalPrice,
    sellPrice: rawData.sellPrice,
    eventStartDate: rawData.eventStartDate,
    eventEndDate: rawData.eventEndDate,
    eventDescription: rawData.eventDescription,
    productOptionList: rawData.productOptionList,
    productDetailInfo: rawData.productDetailInfo,
    mediaList: rawData.mediaList,
    productDetailInfoImages: rawData.productDetailInfoImages,
    manufacturer: rawData.manufacturer,
    madeInOrigin: rawData.madeInOrigin,
    consignmentStore: rawData.consignmentStore,
    memo: rawData.memo,
  };
  // return rawData.map(
  //   ({
  //     supplierId, // 공급사 id
  //     supplierCompany, // 공급사명
  //     businessNumber, // 사업자번호
  //     frcNumber,
  //     represent, // 대표명
  //     address, // 주소
  //     recallAddress, // 반품주소
  //     tel, // 일반 전화
  //     csCall, // CS전화
  //     csInfo, // CS정보
  //     personInCharge, // 담당자 명
  //     contactCall, // 담당자 연락처
  //     email, // 담당자 이메일
  //     brandId,
  //     brand, // 브랜드
  //     upCategoryId,
  //     upCategory, // 상위 카테고리
  //     middleCategoryId,
  //     middleCategory, // 중간 카테고리
  //     downCategoryId,
  //     downCategory, // 하위 카테고리
  //     productId,
  //     productName, // 제품 명
  //     classificationCode,
  //     labelList, // 매핑된 라벨 리스트
  //     modelNumber, // 모델 번호
  //     deliveryType, // 배송 유형
  //     sellClassification, // 판매 구분 (전체 - A / 기업 - B / 일반 - C)
  //     expressionCheck, // 노출 여부 (Y/N)
  //     normalPrice, // 정상 가격
  //     sellPrice, // 판매 가격
  //     deliveryPrice, // 배달비
  //     purchasePrice, // 구입 가격 (매입 단가)
  //     eventStartDate, // 이벤트 시작 날짜
  //     eventEndDate, // 이벤트 끝 날짜
  //     eventDescription, // 이벤트 비고
  //     optionCheck, // 옵션 사용 여부 (Y / N)
  //     productOptionList, // 제품에 해당되는 옵션
  //     productDetailInfo, // 제품 상세 정보
  //     mediaList, // 제품에 연관된 이미지들
  //     productDetailInfoImages,
  //     manufacturer, // 제조사
  //     madeInOrigin, // 원산지
  //     consignmentStore, // 위탁점
  //     memo, // 상품 메모
  //     status, // 제품 상태
  //   }) => {
  //     return {
  //       supplierId: supplierId,
  //       supplierCompany: supplierCompany,
  //       businessNumber: businessNumber,
  //       frcNumber: frcNumber,
  //       represent: represent,
  //       address: address,
  //       recallAddress: recallAddress,
  //       tel: tel,
  //       csCall: csCall,
  //       csInfo: csInfo,
  //       personInCharge: personInCharge,
  //       contactCall: contactCall,
  //       email: email,
  //       brandId: brandId,
  //       brand: brand,
  //       upCategoryId: upCategoryId,
  //       upCategory: upCategory,
  //       middleCategoryId: middleCategoryId,
  //       middleCategory: middleCategory,
  //       downCategoryId: downCategoryId,
  //       downCategory: downCategory,
  //       productId: productId,
  //       productName: productName,
  //       classificationCode: classificationCode,
  //       labelList: labelList,
  //       modelNumber: modelNumber,
  //       deliveryType: deliveryType,
  //       sellClassification: sellClassification,
  //       normalPrice: normalPrice,
  //       sellPrice: sellPrice,
  //       eventStartDate: eventStartDate,
  //       eventEndDate: eventEndDate,
  //       eventDescription: eventDescription,
  //       productOptionList: productOptionList,
  //       productDetailInfo: productDetailInfo,
  //       mediaList: mediaList,
  //       productDetailInfoImages: productDetailInfoImages,
  //       manufacturer: manufacturer,
  //       madeInOrigin: madeInOrigin,
  //       consignmentStore: consignmentStore,
  //     };
  // }
};
