import React, { useState, useEffect } from "react";
import "./EventPage.css";
import HProductModel from "../Home/models/HProductModel";
import useHttp from "../../components/hooks/useHttp";
import PageLoader from "../../components/loaders/PageLoader";

const EventPage = ({ festive }) => {
  const { isLoading, error, sendRequest } = useHttp();
  const [eventData, setEventData] = useState({
    "day deals": [],
    "festive deals": [],
  });

  const fest = () => {
    if (festive === "Mobile Mania") return "mobile-mania";
    if (festive === "LapFest") return "lapfest";
    if (festive === "Premium Sale") return "premium-sale";
  };
  const fest_str = fest();

  useEffect(() => {
    if (!fest_str) return;
    sendRequest(
      {
        url: `http://localhost:5000/api/event/${fest_str}`,
        method: "GET",
      },
      (data) => setEventData(data),
    );
  }, [fest_str, sendRequest]);

  const getThemeClass = () => {
    if (festive === "LapFest") return "theme-lapfest";
    if (festive === "Premium Sale") return "theme-premium";
    return "";
  };

  const side_element = (title, off) => (
    <div className="element-event-topic">
      <span className="eventpage-span-text">{title}</span>
      <div className="discount-bar-container">
        <div className="horizontal-line"></div>
        <div className="parallelogram-container">
          <span className="parallelogram-wrapper">
            <span className="parallelogram-bg">{off}</span>
          </span>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <PageLoader />;

  return (
    <div className={`eventpage ${getThemeClass()}`}>
      <div className="eventpage-main-content">
        <div className="row one">
          <img
            src={`/banners/${fest_str}.png`}
            alt={festive}
            className="eventpage-img"
          />
          <div>
            <h2 className="eventpage-main-title accent">{festive}</h2>
            {side_element("OFFER STARTS FROM", "45%")}
            {side_element("SAVE UPTO", "65%")}
            {side_element("CUSTOMERS BENEFITED", "85K+")}
            {side_element("PRODUCTS SOLD", "86k+")}
            {side_element("TOTAL FESTIVE SAVINGS", "90L+")}
          </div>
        </div>

        <h2 className="eventpage-section-title accent">Deal of the Day</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="row products-wrap">
          {eventData["day deals"].map((product, index) => (
            <div className="day-deal" key={index}>
              <HProductModel product_details={product} />
            </div>
          ))}
        </div>

        <h2 className="eventpage-section-title accent">Festive Sale</h2>

        <div className="row products-wrap">
          {eventData["festive deals"].map((product, index) => (
            <div className="day-deal" key={index}>
              <HProductModel product_details={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
