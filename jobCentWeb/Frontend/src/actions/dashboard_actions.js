import * as ApiUtil from "../util/session_api_util";
export const RECEIVE_BALANCE = "RECEIVE_BALANCE";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";

export const receiveBalance = balance => ({
  type: RECEIVE_BALANCE,
  balance
});

export const receiveErrors = errors => ({
    type: RECEIVE_SESSION_ERRORS,
    errors
});

export const fetchBalance = user => dispatch =>
  ApiUtil.fetchBalance(user).then(
    balance => dispatch(receiveBalance(balance)),
    err => {
      console.log(err);

      dispatch(receiveErrors(err));
    }
  );
