import React, { Component } from "react";
import "../../scss/components/session.css";

class SessionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      code: ""
    };
  }

  renderErrors() {
    if (this.props.errors) {
      return (
        <ul className="errors">
          {this.props.errors.map((error, idx) => (
            <li key={`${idx}`}>{error}</li>
          ))}
        </ul>
      );
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

  handleSubmit = e => {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.processForm({ user });
  };

  render() {
    if (this.props.formType === "signup") {
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
                >
                  <div className="field">
                    <input
                      type="text"
                      aria-label="Enter your email"
                      name="alias"
                      autoComplete="off"
                      spellCheck="false"
                      autoCapitalize="none"
                      className="text-field"
                      placeholder="Email"
                    />
                  </div>

                  <div className="alias-submit fade-in immediate ">
                    <div
                      id="ember458"
                      className="cta submit-button-component submit-button-with-spinner ember-view"
                    >
                      <button
                        type="submit"
                        aria-label="Request Sign In Code"
                        className="button theme-button theme-button"
                        data-ember-action=""
                        data-ember-action-459="459"
                      >
                        Request Sign In Code
                      </button>
                      <div
                        id="ember464"
                        className="spinner-container ember-view"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </section>

            <div id="ember467" className="modal-manager ember-view">
              <div className="modal-overlay " />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          login
          <div />
        </div>
      );
    }
  }
}

export default SessionForm;
