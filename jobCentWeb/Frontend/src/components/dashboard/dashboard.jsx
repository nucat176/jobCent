import React, { Component } from "react";
import "../../scss/components/dashboard.css";
import { Activity } from "./activity";
import { MyJobCents } from "./myJobCents";
import { MyProfile } from "./myProfile";
import { SignOut } from "./signOut";
import { Transfer } from "./transfer";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formType: "Activity", jobCents: "0" };
    this.handleInput = this.handleInput.bind(this);
    this.logOut = this.logOut.bind(this);
    this.jobCentsTab = this.jobCentsTab.bind(this);
    // this.reverseState.bind(this);
  }

  componentDidMount() {
   
    this.props.fetchBalance(this.props.currentUser).then(res => {
      console.log(res.balance.data.balance);
      let balance = res.balance.data.balance;
      if (balance) {
        this.setState({jobCents: balance});
      }
    });
    // console.log(this.props.currentUser);

    

    // this.getJobCents();
    // console.log(this.state);
  }

  // getJobCents() {
  //   const user = this.props.currentUser;
  //   new Promise(function(resolve, reject) {
  //     nCentSDKInstance.getTokenBalance(
  //       user.publicKey,
  //       "818abb73-5ab0-4763-861e-0fcd97cc0109",
  //       resolve,
  //       reject
  //     );
  //   })
  //     .then(token => {
  //       console.log(token);
  //       this.setState({ jobCents: token.balance });
  //       return token;
  //     })
  //     .catch(error => {
  //       console.log(error);

  //     });
  // }

  handleInput(key) {
    return e => this.setState({ [key]: e.currentTarget.title });
  }

  activityTab() {
    if (this.state.formType === "Activity") {
      return (
        <section className="flex-container activity-history">
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
                  onClick={this.handleInput("formType")}
                >
                  Send a jobCent
                </a>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }
  jobCentsTab() {
  
    if (this.state.formType === "jobCents") {
      return <MyJobCents jobCents={this.state.jobCents} />;
    }
  }
  profileTab() {
    if (this.state.formType === "Settings") {
      return <MyProfile />;
    }
  }
  transferTab() {
    if (this.state.formType === "New") {
      return <Transfer />;
    }
  }

  signOutTab() {
    if (this.state.formType === "Sign Out") {
      return (
        <div className="modal-scroller">
          <div className="modal-window">
            <div className="modal-window-content">
              <p className="instructions">Are you sure you want to sign out?</p>
            </div>
            <div className="modal-action-bar">
              <a
                title="jobCents"
                onClick={this.handleInput("formType")}
                className="action-button action-b-left"
              >
                No
              </a>
              <a onClick={this.logOut} className="action-button action-b-right">
                Yes
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  logOut() {
    this.props.logout().then(this.props.history.push("/"));
  }

  render() {
    return (
      <div>
        <div className="jobCent-home">
          {" "}
          {/* <div className="cookie-banner " /> */}
          {/* <div className="full-screen-payment-blockers" /> */}
          <div className="flex-container-home ">
            <div className="layout-account-new flex-container-home ">
              <div className="account-navigation-bar flex-container-home">
                <div className="customer-info">
                  <div className="customer-profile-simple">
                    <i
                      style={{ backgroundColor: "#FB60C4" }}
                      className="customer-avatar"
                    >
                      {" "}
                      <div className="initial-placeholder">D</div>
                    </i>
                    <h3 id="ember1124" className="display-name">
                      <span className="name">Alpha Tester</span>
                    </h3>
                    <h4 className="jobTag">
                      <a className="ember-view">$userId</a>
                    </h4>
                  </div>
                </div>
                <nav className="nav-items">
                  <a
                    title="Activity"
                    value="Activity"
                    id="ember1156"
                    className="nav-item active"
                    onClick={this.handleInput("formType")}
                  >
                    {" "}
                    <div id="ember1163" className="inline-svg ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                      >
                        <g fill="#FFF" fillRule="evenodd">
                          <path d="M11 0C4.9 0 0 4.9 0 11s4.9 11 11 11 11-4.9 11-11S17.1 0 11 0zm0 20c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z" />
                          <path d="M12 6h-2v6.5l4.5 2.4 1-1.8-3.5-1.8V6z" />
                        </g>
                      </svg>
                    </div>
                    <span className="nav-item-label">Activity</span>
                  </a>
                  <a
                    title="jobCents"
                    value="jobCents"
                    id="ember1174"
                    className="nav-item"
                    onClick={this.handleInput("formType")}
                  >
                    {" "}
                    <div id="ember1183" className="inline-svg ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                      >
                        <path
                          d="M11 0c6.072 0 11 4.928 11 11s-4.928 11-11 11S0 17.072 0 11 4.928 0 11 0zm0 2c-4.968 0-9 4.032-9 9s4.032 9 9 9 9-4.032 9-9-4.032-9-9-9zm2.303 7.2a.288.288 0 0 0 .403-.009l.552-.569a.296.296 0 0 0-.014-.426 4.341 4.341 0 0 0-1.478-.844l.173-.838a.292.292 0 0 0-.283-.354h-1.065a.29.29 0 0 0-.283.233l-.156.744c-1.416.072-2.616.79-2.616 2.265 0 1.277.993 1.824 2.041 2.202.993.379 1.518.52 1.518 1.052 0 .547-.525.87-1.297.87-.705 0-1.443-.237-2.015-.81a.284.284 0 0 0-.404-.002l-.593.594a.299.299 0 0 0 .002.423 3.9 3.9 0 0 0 1.714.97l-.162.776a.292.292 0 0 0 .28.355l1.067.008a.29.29 0 0 0 .285-.233l.154-.746c1.696-.106 2.734-1.043 2.734-2.416 0-1.262-1.034-1.795-2.29-2.23-.717-.266-1.338-.448-1.338-.995 0-.533.58-.744 1.159-.744.74 0 1.449.305 1.913.724z"
                          fillRule="nonzero"
                        />
                      </svg>
                    </div>
                    <span className="nav-item-label">jobCents</span>
                  </a>
                  <a
                    title="Settings"
                    id="ember1188"
                    className="nav-item settings "
                    onClick={this.handleInput("formType")}
                  >
                    {" "}
                    <div id="ember1197" className="inline-svg ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                      >
                        <g fill="#FFF" fillRule="evenodd">
                          <path d="M22.5 11c0-6.1-4.9-11-11-11S.5 4.9.5 11c0 4.7 2.9 8.7 7.1 10.3 1.1.5 2.4.7 3.9.7s2.9-.3 3.9-.7c4.2-1.6 7.1-5.6 7.1-10.3zm-5.4 7c-.8-1.2-3-2-5.6-2-2.6 0-4.8.8-5.6 2-2-1.7-3.4-4.2-3.4-7 0-5 4-9 9-9s9 4 9 9c0 2.8-1.3 5.3-3.4 7z" />
                          <circle cx="11.5" cy="9" r="3" />
                        </g>
                      </svg>
                    </div>
                    <span className="nav-item-label">Settings</span>
                  </a>{" "}
                  <a
                    title="Sign Out"
                    className="nav-item signout"
                    onClick={this.handleInput("formType")}
                  >
                    <div id="ember1207" className="inline-svg ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                      >
                        <g fill="#FFF" fillRule="evenodd">
                          <path d="M11.5 22c-6.1 0-11-4.9-11-11s4.9-11 11-11 11 4.9 11 11-4.9 11-11 11zm0-20c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z" />
                          <path d="M7 10h9v2H7z" />
                        </g>
                      </svg>
                    </div>
                    <span className="nav-item-label">Sign Out</span>
                  </a>
                  <a
                    title="New"
                    className="nav-item create-payment"
                    onClick={this.handleInput("formType")}
                  >
                    <span className="button-text">New</span>
                  </a>
                </nav>
              </div>
              <section className="yield-content">
                {this.activityTab()}
                {this.jobCentsTab()}
                {this.profileTab()}
                {this.signOutTab(this.props.logout)}
                {this.transferTab()}
                {/* <Activity/> */}
                {/* <MyJobCents/> */}
                {/* <MyProfile/> */}
                {/* <SignOut/> */}
                {/* <Transfer /> */}
              </section>
            </div>
          </div>
          <div className="modal-manager ">
            <div className="modal-overlay " />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
