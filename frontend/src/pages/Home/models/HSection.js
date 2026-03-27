import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HProductModel from "./HProductModel";
import "./HSection.css";

export default function HSection({ title, DB, variant, onRemove }) {
  const sliderRef = useRef(null);

  const isHome = variant === "home";
  const isWishlist = variant === "wishlist";

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = (dir) => {
    if (!isHome) return;
    const node = sliderRef.current;
    if (!node) return;
    const itemWidth = node.firstChild?.offsetWidth || 270;
    const gap = 15;
    const scroll = (itemWidth + gap) * 4;
    node.scrollBy({
      left: dir === "left" ? -scroll : scroll,
      behavior: "smooth",
    });
  };

  const checkScroll = () => {
    if (!isHome) return;
    const node = sliderRef.current;
    if (!node) return;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    if (!isHome) return;
    const node = sliderRef.current;
    if (!node) return;
    checkScroll();
    node.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      node.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [isHome]);

  return (
    <div className={`hsection-container ${isWishlist ? "wishlist-mode" : ""}`}>
      {isHome && (
        <div className="hsection-header">
          <h2 className="hsection-title">{title}</h2>
        </div>
      )}

      <div
        className={isHome ? "hsection-slider-wrapper" : "hsection-grid-wrapper"}
      >
        {isHome && (
          <button
            className={`slider-arrow left ${!canScrollLeft ? "disabled" : ""}`}
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
          >
            <FaChevronLeft />
          </button>
        )}

        <div
          className={isHome ? "hsection-slider" : "hsection-grid"}
          ref={sliderRef}
        >
          {DB.map((product) => (
            <HProductModel
              key={product._id || product.id}
              product_details={product}
              variant={variant}
              onRemove={onRemove} // ← pass down
            />
          ))}
        </div>

        {isHome && (
          <button
            className={`slider-arrow right ${!canScrollRight ? "disabled" : ""}`}
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
