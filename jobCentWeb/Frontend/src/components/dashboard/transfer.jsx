import React from "react";

export const Transfer = () => (
  <div className="fs-transfer-sheet">
    <div className="transfer-content">
      <div className="close-button">
        <p />
      </div>
      <div className="initiate-tranfer">
        <div className="display-amount-fixed">
            <div>
                <div className="display-amount-input">
                <div className="currency-symbol"></div>
                <input type="tel" className="whole-amount-value"></input>
                </div>
            </div>
        </div>
        <div className="enter-email"></div>
        <div className="transfer-button"></div>
      </div>
    </div>
  </div>
);
