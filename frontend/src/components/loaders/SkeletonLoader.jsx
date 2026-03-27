import React from "react";
import "./Loader.css";

const SkeletonLoader = ({
  width = "100%",
  height = "20px",
  borderRadius = "6px",
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width, height, borderRadius, marginBottom: "10px" }}
        ></div>
      ))}
    </>
  );
};

export default SkeletonLoader;
