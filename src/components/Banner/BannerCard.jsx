import React from "react";
import "../../styles/Banner.css";

function BannerCard(props) {
  return (
    <div className="banner-image-container">
      <img src={props.bannerImage} className="banner-image"></img>
    </div>
  );
}

export default BannerCard;
