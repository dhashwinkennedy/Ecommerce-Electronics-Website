import React from 'react';
import './AdditionalFeatureTable.css';

const AdditionalFeatureTable = ({ additional_features }) => {
  // Guard clause: If no data is passed, don't render anything
  if (!additional_features || Object.keys(additional_features).length === 0) {
    return null;
  }

  return (
    <div className="aft-container">
      {Object.entries(additional_features).map(([category, attributes]) => (
        <div key={category} className="aft-category-group">
          {/* Main Category Title */}
          <div className="aft-category-header">
            {category}
          </div>

          {/* Rows for the specific attributes */}
          <div className="aft-attributes-list">
            {Object.entries(attributes).map(([key, value]) => (
              <div key={key} className="aft-row">
                <div className="aft-col-key">{key}</div>
                <div className="aft-col-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalFeatureTable;