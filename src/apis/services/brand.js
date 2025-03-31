export const brand = (rawData) => {
  return rawData.map(({ brandId, brandTitle, status, mediaId, mediaUrl }) => {
    return {
      brandId: brandId,
      brandTitle: brandTitle,
      status: status,
      mediaId: mediaId,
      mediaUrl: mediaUrl,
    };
  });
};
