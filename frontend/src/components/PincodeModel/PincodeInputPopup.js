import React, { useState } from "react";
import "./PincodeInputPopup.css";

const PincodeInputPopup = ({ currentPincode, onSave, onClose }) => {
  const [newPincode, setNewPincode] = useState(currentPincode);

  const handleSave = () => {
    onSave(newPincode);
  };

  return (
    <div className="pincode-overlay" onClick={onClose}>
      <div
        className="pincode-popup-drawer"
        onClick={(e) => e.stopPropagation()} // prevent closing on click inside
      >
        <h3>Change Delivery Pincode</h3>
        <input
          type="text"
          value={newPincode}
          onChange={(e) => setNewPincode(e.target.value)}
          maxLength="6"
          placeholder="Enter 6-digit pincode"
        />
        <div className="pincode-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PincodeInputPopup;
