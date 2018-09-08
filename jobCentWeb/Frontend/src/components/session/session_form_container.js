import { connect } from 'react-redux';
import SessionForm from './session_form';
import { login, signup, clearErrors } from '../../actions/session_actions';

const mapStateToProps = (state, ownProps) => ({
    path: ownProps.test,
    loggedIn: Boolean(state.session.currentUser),
    errors: state.errors.session,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    const formType = ownProps.location.pathname.slice(1);
    const processForm = (formType === "login") ? login : signup;
    return {
        processForm: user => dispatch(processForm(user)),
        clearErrors: () => dispatch(clearErrors()),
        login: user => dispatch(login(user)),
        formType,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionForm);
