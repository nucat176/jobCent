import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';


const Auth = ({component: Component, path, loggedIn}) => (
  <Route path={path} render={(props) => (
      !loggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to="/dashboard" />
      )
    )} />
);

const Protected = ({component: Component, path, loggedIn}) => (
  <Route path={path} render={(props) => {

      if (loggedIn) {
        return <Component {...props} />;

      } else {
        // origin = path;
        return <Redirect to="/login" />;
      }
    }} />
);

const mapStateToProps = state => {
    // state.origin = null;
  return ({
    loggedIn: Boolean(state.session.currentUser),
    // origin: state.origin
  });
};

export const AuthRoute = withRouter(connect(mapStateToProps, null)(Auth));
export const ProtectedRoute = withRouter(connect(mapStateToProps, null)(Protected));
