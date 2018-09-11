import React, { Component } from "react";
import "../../scss/components/session.css";

class SessionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      code: "",
      otpReq: true,
      formType: "signup"
    };
  }

  renderErrors() {
    if (this.props.errors) {
      console.log(this.props.errors);

    }
  }

  update(input) {
    return e =>
      this.setState({
        [input]: e.currentTarget.value
      });
  }

  componentWillMount() {
    this.props.clearErrors();
  }

  componentDidMount() {
    document.getElementById("text").value = "";
  }

  componentWillReceiveProps() {
    document.getElementById("text").value = "";
  }

  handleSubmit = e => {
    const processForm =
      this.state.formType === "signup" ? this.props.signup : this.props.login;
    e.preventDefault();
    const user = Object.assign({}, this.state);

    processForm(user).then(user => {
      if (this.state.formType === "signup") {
        document.getElementById("text").value = "";
        this.setState({ formType: "login" });
      }
    });
  };

  render() {
    if (this.state.formType === "signup") {
      return (
        <div className="signup-form">
          <div className="signup-component">
            <div />
            <section className="flex-container">
              <div className="login-container">
                <h1 className="step-title">Sign in to jobCent</h1>

                <form
                  autoComplete="off"
                  spellCheck="true"
                  noValidate="true"
                  className="login-form"
                  onSubmit={this.handleSubmit}
                >
                  <div className="field">
                    <input
                      id="text"
                      type="text"
                      aria-label="Enter your email"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Email address"
                      onChange={this.update("email")}
                    />
                  </div>

                  <div className="alias-submit">
                    <div className="submit-button-component ">
                      <button
                        type="submit"
                        aria-label="Request Sign In Code"
                        className="theme-button"
                      >
                        Request Sign In Code
                      </button>
                      <div className="spinner-container " />
                    </div>
                  </div>
                </form>
              </div>
            </section>
            {this.renderErrors()}
            <div className="modal-manager ">
              <div className="modal-overlay " />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="signup-form">
          <div className="signup-component">
            <div />
            <section className="flex-container">
              <div className="login-container">
                <h1 className="step-title">
                  Cool! We emailed a code to {this.state.email}
                </h1>

                <form
                  autoComplete="off"
                  spellCheck="true"
                  noValidate="true"
                  className="login-form"
                  onSubmit={this.handleSubmit}
                >
                  <div className="field">
                    <input
                      id="text"
                      type="text"
                      aria-label="confirmation code"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Confirmation Code"
                      onChange={this.update("code")}
                    />
                  </div>

                  <div className="alias-submit">
                    <div className="submit-button-component ">
                      <button
                        type="submit"
                        aria-label="Request Sign In Code"
                        className="theme-button"
                      >
                        Sign In
                      </button>
                      <div className="spinner-container " />
                    </div>
                  </div>
                </form>
              </div>
            </section>
            {this.renderErrors()}
            <div className="modal-manager ">
              <div className="modal-overlay " />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default SessionForm;
