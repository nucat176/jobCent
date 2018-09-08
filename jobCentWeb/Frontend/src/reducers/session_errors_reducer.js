import { RECEIVE_SESSION_ERRORS, RECEIVE_CURRENT_USER, CLEAR_ERRORS } from '../actions/session_actions';

export default (state = [], action) => {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return null;
        case CLEAR_ERRORS:
            return null;
        case RECEIVE_SESSION_ERRORS:
            // console.log(action);
            
            return action;
        default:
            return state;
    }
};