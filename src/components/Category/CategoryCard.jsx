import React from "react";
import "../../styles/Category.css";

function CategoryCard(props) {
  return (
    <div className="category-image-container">
      <img src={props.categoryImage} className="category-image"></img>
      <p>{props.categoryName}</p>
    </div>
  );
}

export default CategoryCard;
