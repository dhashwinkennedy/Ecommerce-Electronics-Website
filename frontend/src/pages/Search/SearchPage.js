import React, { useEffect, useState } from "react";
import "./SearchPage.css";
import SearchProductModel from "./models/SearchProductModel";
import { useSearchParams } from "react-router-dom";
import useHttp from "../../components/hooks/useHttp";
import PageLoader from "../../components/loaders/PageLoader";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const { isLoading, error, sendRequest } = useHttp();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    sendRequest(
      {
        url: `http://localhost:5000/api/search?q=${query}`,
        method: "GET",
      },
      (data) => {
        setResults(data.products || []);
      },
    );
  }, [query, sendRequest]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="searchpage">
      <div className="searchpage-main-content">
        <h2 className="searchpage-main-title accent">
          {`Showing Results for "${query}"`}
        </h2>
        <br />
        <h3 className="searchpage-main-title secondary">
          {`Showing ${results.length} result${results.length !== 1 ? "s" : ""}`}
        </h3>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
            {error}
          </p>
        )}

        {!isLoading && results.length === 0 && !error && (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
            No products found for "{query}"
          </p>
        )}

        <div className="searchpage-items">
          {results.map((productDetails) => (
            <SearchProductModel
              key={productDetails._id || productDetails.id}
              details={productDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
