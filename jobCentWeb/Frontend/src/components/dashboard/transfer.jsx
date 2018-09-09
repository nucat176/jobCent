import React from "react";
import "../../scss/components/transfer.css";

export const Transfer = () => (
  <div className="fs-transfer-sheet">
    <div className="transfer-content">
      <div className="close-button">
        <i className="close-button-icon" />
      </div>
      <div className="initiate-transfer">
        <div className="display-amount-fixed">
          <div>
            <div className="display-amount-input">
              <div className="currency-symbol">₿</div>
              <input
                placeholder="0"
                autoComplete="off"
                maxLength="3"
                type="tel"
                className="whole-amount-value"
              />
              {/* <input type="tel" name="fractional-amount-value" autocomplete="off" tabindex="-1" placeholder="00" maxlength="2" id="ember1284" class=""/> */}
            </div>
          </div>
        </div>
        <div className="enter-email">
          <label htmlFor="">To:</label>
          <div className="recipiens">
            <div className="token-list">
              <input
                className="transfer-input-field"
                autoComplete="off"
                spellCheck="false"
                placeholder="Email address"
                autoCorrect="false"
                autoCapitalize="off"
                type="text"
              />
            </div>
          </div>
          <div className="anchor" />
          <div className="error-box" />
        </div>
        <button className="theme-button transfer-button">Send jobCent</button>
      </div>
    </div>
  </div>
);
