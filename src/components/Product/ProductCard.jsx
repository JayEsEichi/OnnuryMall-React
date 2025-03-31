import React from "react";
import "../../styles/Product.css";

// 제품 카드
function ProductCard(props) {
  return (
    <div className="product-container">
      <div className="image-protector">
        <img src={props.thumbnailImg} className="product-image"></img>
      </div>
      <div className="product-several-info">
        <div className="brand-and-type">
          <p className="brand-name">{props.brand}</p>
          <p className="product-type">
            {props.productType === "D" ? "배달 제품" : "설치 제품"}
          </p>
        </div>
        <p className="product-name">{props.productName}</p>
        <p className="price-text">{props.sellPrice}원</p>
      </div>
    </div>
  );
}

export default ProductCard;
