import React, { useState, useEffect } from "react";
import Banner from "./models/Banner";
import HSection from "./models/HSection";
import "./HomePage.css";
import useHttp from "../../components/hooks/useHttp";
import PageLoader from "../../components/loaders/PageLoader";

const HomePage = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const [homeData, setHomeData] = useState({ "best deals": [] });

  useEffect(() => {
    sendRequest(
      { url: "http://localhost:5000/api/homepage", method: "GET" },
      (data) => setHomeData(data),
    );
  }, [sendRequest]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="HomePage">
      <Banner />
      <div className="HomePage-main-content">
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {Object.entries(homeData).map(([key, value]) => (
          <HSection key={key} title={key} DB={value} variant="home" />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
