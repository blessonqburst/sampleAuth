import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import auth, { LOGOUT } from './auth';
import loader from './loader';
import clients from './clients';
import profile from './profile';
import users from './users';

const appReducer = combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  loader,
  clients,
  profile,
  users,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
