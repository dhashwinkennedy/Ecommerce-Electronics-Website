import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Banner.css";
import { NavLink } from "react-router-dom";

// import your images

const Banner = () => {
  const banners = [
    "/banners/mobile-mania.png",
    "/banners/lapfest.png",
    "/banners/premium-sale.png",
  ];
  const [index, setIndex] = useState(0);

  // calculate positions dynamically
  const getPrevIndex = () => (index - 1 + banners.length) % banners.length;
  const getNextIndex = () => (index + 1) % banners.length;

  const handleNext = () => setIndex(getNextIndex());
  const handlePrev = () => setIndex(getPrevIndex());
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <div className="banners">
      {/* LEFT BUTTON */}
      <button className="nav-btn left" onClick={handlePrev}>
        <ChevronLeft size={35} />
      </button>

      {/* PRE Banner (1/4 visible left side) */}
      <div className="banner pre-banner" onClick={handlePrev}>
        <img src={banners[getPrevIndex()]} alt="Previous banner preview" />
      </div>

      {/* MAIN Banner (centered) */}
      <div className="banner main-banner">
        <NavLink
          to={`/${banners[index].replace("/banners/", "").replace(".png", "")}`}
          end
        >
          <img src={banners[index]} alt="Main promotional banner" />
        </NavLink>
      </div>

      {/* POST Banner (1/4 visible right side) */}
      <div className="banner post-banner" onClick={handleNext}>
        <img src={banners[getNextIndex()]} alt="Next banner preview" />
      </div>

      {/* RIGHT BUTTON */}
      <button className="nav-btn right" onClick={handleNext}>
        <ChevronRight size={35} />
      </button>
    </div>
  );
};

export default Banner;
