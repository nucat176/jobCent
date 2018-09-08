import React from 'react';

export const Activity = () => (
  <section className="flex-container activity-history">
    {/* <header className="activity-header flex-static">
                    <div className="header-content flex-container flex-h">
                      <label
                        for="search_term"
                        className="header-icon icon-search"
                      />
                      <form id="ember2422" className="search-bar ">
                        {" "}
                        <div
                          id="ember2431"
                          className="field fk-field-container "
                        >
                          <input
                            type="text"
                            aria-label="Search"
                            name="searchTerm"
                            autocomplete="off"
                            spellcheck="false"
                            autocapitalize="off"
                            id="search_term"
                            className="ember-text-field "
                            placeholder="Search"
                          />
                        </div>
                      </form>{" "}
                      <a
                        href="https://cash.me/account/activity#"
                        title="Statements"
                        data-link-label="Toggle statement selector"
                        className="header-icon icon-csv-download statement-selector-trigger  "
                        data-ember-action=""
                        data-ember-action-2436="2436"
                      >
                        <span className="download-text">Statements</span>
                      </a>
                    </div>
                    <div
                      id="ember2441"
                      className="flyout-menu activity-statement-selector "
                    >
                      {" "}
                      <div
                        id="ember2442"
                        className="scroll-container activity-available-statement-list "
                      >
                        <a
                          href=""
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Export CSV"
                          data-link-label="Download CSV"
                          className="export-csv"
                        >
                          Export CSV
                        </a>
                        <a
                          href=""
                          className="activity-statement-selector-item"
                          data-ember-action=""
                          data-ember-action-2451="2451"
                        >
                          August 2018
                        </a>
                      </div>
                    </div>{" "}
                  </header> */}
    <div className=" activity-list-container  ">
      {" "}
      <div id="ember2453" className="activity-list-sections ">
        {" "}
        <div className="activity-no-results">
          <div className="inline-svg-two ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84">
              <path d="M80 42c0 20.949-17.051 38-38 38S4 62.949 4 42 21.051 4 42 4s38 17.051 38 38zm4 0C84 18.842 65.158 0 42 0S0 18.842 0 42s18.842 42 42 42 42-18.842 42-42z" />
              <path d="M40 22V46.865l1.075.56 16 8.348 1.85-3.546-16-8.348L44 45.652V22h-4z" />
            </svg>
          </div>
          <h3 className="title-activity">No Activity Yet</h3>
          <a
            title="New"
            className="initiate-payment"
            onClick={this.props.handleInput("formType")}
          >
            Create a Payment
          </a>
        </div>
      </div>
    </div>
  </section>
);
