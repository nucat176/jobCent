import { connect } from "react-redux";
import Dashboard from "./dashboard";
import { logout } from "../../actions/session_actions";
// import { fetchBalance, fetchHistory, sendJobCents } from "../../actions/dashboard_actions";

const mapStateToProps = (state, ownProps) => ({
  path: ownProps.test,
  loggedIn: Boolean(state.session.currentUser),
  errors: state.errors.session
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // fetchBalance: user => dispatch(fetchBalance(user)),
  // fetchHistory: () => dispatch(fetchHistory()),
  // sendJobCents: () => dispatch(sendJobCents()),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);