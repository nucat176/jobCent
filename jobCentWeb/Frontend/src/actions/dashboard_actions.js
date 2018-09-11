import * as ApiUtil from "../util/session_api_util";
export const RECEIVE_BALANCE = "RECEIVE_BALANCE";
export const RECEIVE_TRANSFER = "RECEIVE_TRANSFER";
export const RECEIVE_DASH_ERRORS = "RECEIVE_DASH_ERRORS";
export const RECEIVE_HISTORY = "RECEIVE_HISTORY";

export const receiveBalance = balance => ({
  type: RECEIVE_BALANCE,
  balance
});

export const receiveErrors = errors => ({
  type: RECEIVE_DASH_ERRORS,
  errors
});

export const receiveTransfer = data => ({
  type: RECEIVE_TRANSFER,
  data
});

export const receiveHistory = history => ({
  type: RECEIVE_HISTORY,
  history
});

export const fetchBalance = user => dispatch =>
  ApiUtil.fetchBalance(user).then(
    balance => dispatch(receiveBalance(balance)),
    err => {
      console.log(err);
      dispatch(receiveErrors(err));
    }
  );

export const sendJobCents = transaction => dispatch =>
  ApiUtil.sendJobCents(transaction).then(
    data => dispatch(receiveTransfer(data)),
    err => {
      console.log(err);
      dispatch(receiveErrors(err));
    }
  );

export const saveName = user => dispatch =>
  ApiUtil.saveName(user).then(
    data => console.log(data),
    err => {
      console.log(err);
      dispatch(receiveErrors(err));
    }
  );

export const fetchHistory = user => dispatch =>
  ApiUtil.fetchHistory(user).then(
    data => dispatch(receiveHistory(data)),
    err => {
      console.log(err);
      dispatch(receiveErrors(err));
    }
  );
