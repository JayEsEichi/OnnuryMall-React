import React, { useState } from "react";
import "../../styles/Review.css";

// 제품 상세 페이지 노출 리뷰 컨텐츠
function Review(props) {
  // 리뷰 좋아요
  const [reviewLikeCount, setReviewLikeCount] = useState(0);

  // 리뷰 좋아요 버튼 동작
  const handleReviewLike = () => {
    setReviewLikeCount((prev) => prev + 1);
  };

  return (
    <div className="review-content-container">
      <div className="review-content">
        <div className="review-detail-info">
          <div className="reviewer-info">
            <div className="reviewer-profile-image">
              <img src={props.profileImage}></img>
            </div>
            <div className="star-rate-and-nickname-and-review-title">
              <div className="star-rate">
                <div className="stars" style={{ "--rating": 4 }}></div>
                <strong>{props.reviewStarRateCount}</strong>
              </div>
              <div className="user-info">
                <strong>{props.nickname}</strong>
                <span>{props.createdAt}</span>
                <span>신고</span>
              </div>
              <div className="buy-product-info">
                <strong>구매 제품 : {props.productInfo}</strong>
              </div>
              <div className="review-title">
                <span>{props.reviewTitle}</span>
              </div>
            </div>
          </div>
          <div className="review-detail-text">{props.reviewContent}</div>
        </div>
        <div className="review-media-content">
          <img src={props.reviewImage}></img>
        </div>
      </div>
      <div className="like-review">
        <button className="like-review-btn" onClick={handleReviewLike}>
          따봉~ {reviewLikeCount}
        </button>
      </div>
    </div>
  );
}

export default Review;
