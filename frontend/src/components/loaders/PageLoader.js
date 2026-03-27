import React from "react";
import "./Loader.css";

const PageLoader = () => {
  return (
    <div className="page-loader-overlay">
      <div className="dots-wrapper">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default PageLoader;
