import { generateURL, demoUrl, authClientBase } from '../../config';
import { updateLoader } from './loader';
import { push } from 'react-router-redux';

const LOAD = 'securehome/auth/LOAD';
const LOAD_SUCCESS = 'securehome/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'securehome/auth/LOAD_FAIL';

const LOAD_USER = 'securehome/auth/LOAD_USER';
const LOAD_USER_SUCCESS = 'securehome/auth/LOAD_USER_SUCCESS';
const LOAD_USER_FAIL = 'securehome/auth/LOAD_FAIL';
const FETCH_USER_DETAILS_API_KEY = 'getUserDetails';

const LOGIN = 'securehome/auth/LOGIN';
const LOGIN_SUCCESS = 'securehome/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'securehome/auth/LOGIN_FAIL';
const LOGIN_API_KEY = 'authLogin';

const TOKEN = 'omniaauth/auth/LOGIN';
const TOKEN_SUCCESS = 'omniaauth/auth/TOKEN_SUCCESS';
const TOKEN_FAIL = 'omniaauth/auth/TOKEN_FAIL';
const TOKEN_API_KEY = 'getToken';

const AUTH_LOGIN = 'omniaauth/auth/AUTH_LOGIN';
const AUTH_LOGIN_SUCCESS = 'omniaauth/auth/AUTH_LOGIN_SUCCESS';
const AUTH_LOGIN_FAIL = 'omniaauth/auth/AUTH_LOGIN_FAIL';
const AUTH_LOGIN_API_KEY = 'getLogin';

const USER_LOGIN = 'omniaauth/auth/USER_LOGIN';
const USER_LOGIN_SUCCESS = 'omniaauth/auth/USER_LOGIN_SUCCESS';
const USER_LOGIN_FAIL = 'omniaauth/auth/USER_LOGIN_FAIL';
const USER_LOGIN_API_KEY = 'userLoginDetails';

const REFRESH = 'securehome/auth/REFRESH';
const REFRESH_SUCCESS = 'securehome/auth/REFRESH_SUCCESS';
const REFRESH_FAILURE = 'securehome/auth/REFRESH_FAILURE';
const REFRESH_API_KEY = 'authRefreshToken';

export const LOGOUT = 'securehome/auth/LOGOUT';
const RESET_PASSWORD = 'securehome/auth/RESET_PASSWORD';
const RESET_PASSWORD_SUCCESS = 'securehome/auth/RESET_PASSWORD_SUCCESS';
const RESET_PASSWORD_FAIL = 'securehome/auth/RESET_PASSWORD_FAIL';
const RESET_PASSWORD_API_KEY = 'authResetPassword';

const SHOW_NOTIFICATION = 'securehome/app/SHOW_NOTIFICATION';
const HIDE_NOTIFICATION = 'securehome/app/HIDE_NOTIFICATION';

const initialState = {
  loaded: false,
  notification: { show: false },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    case LOGIN:
    case REFRESH:
      return {
        ...state,
        loginError: null,
        loggingIn: true,
      };
    case LOGIN_SUCCESS:
    case REFRESH_SUCCESS:
      return {
        ...state,
        loggingIn: false,
      };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        user: { ...action.result, token: localStorage.getItem('useraccess')},
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: { ...action.result.user, token: action.result.access_token },
      };
    case LOGIN_FAIL:
    case REFRESH_FAILURE:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        loginError: action.error
      };
    case RESET_PASSWORD:
      return {
        ...state,
        loginError: null,
        submitting: true,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        submitting: false,
        user: action.result,
      };
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        submitting: false,
        user: null,
        submitError: action.error,
      };
    case SHOW_NOTIFICATION:
      return {
        ...state,
        notification: {
          show: true,
          type: action.messagetype,
          message: action.message,
        },
      };
    case HIDE_NOTIFICATION:
      return {
        ...state,
        notification: { show: false },
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function getToken(data) {
  return (dispatch) => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [TOKEN, TOKEN_SUCCESS, TOKEN_FAIL],
      promise: client => client.post(generateURL(TOKEN_API_KEY), { data }).then((result) => {
        const { expires_in, id_token, token_type } = result;
        const idToken = JSON.parse(atob(id_token.split('.')[1]));
        localStorage.setItem('userexpiry', expires_in);
        localStorage.setItem('useraccess', id_token);
        dispatch(updateLoader(false));
        dispatch(loadUser(idToken.sub));
        return result;
      }).catch((err) => {
        dispatch(updateLoader(false));
        throw err;
      }),
    });
  }
}

export function getLogin() {
  return dispatch => dispatch({
    types: [AUTH_LOGIN, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAIL],
    promise: client => client.get(generateURL(AUTH_LOGIN_API_KEY)).then((result) => {
      if (result.id_token) {
        const { expires_in, id_token, token_type } = result;
        const idToken = JSON.parse(atob(id_token.split('.')[1]));
        localStorage.setItem('userexpiry', expires_in);
        localStorage.setItem('useraccess', id_token);
        dispatch(updateLoader(false));
        dispatch(loadUser(idToken.sub));
        return result;
      }
      return window.location.assign(authClientBase);
    }).catch((err) => {
      dispatch(updateLoader(false));
      throw err;
    }),
  });
}


export function logout(message) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.demo) {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'RP_LOGIN=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.clear();
    window.location.assign(demoUrl);
  } else {
    localStorage.clear();
  }

  return { type: LOGOUT, error: message };
}

export function loadUser(userId) {
  return dispatch => dispatch({
    types: [LOAD_USER,LOAD_USER_SUCCESS,LOAD_USER_FAIL],
    promise: client => client.get(generateURL(FETCH_USER_DETAILS_API_KEY).replace('%d',userId)).then((result) => {
      console.log("user details ", result);
      localStorage.setItem('user', JSON.stringify(result));
      return result;
    })
    .then(() => window.location.assign("/clients"))
    .catch((err) => {
      dispatch(updateLoader(false));
      throw err;
    }),
  });
}

export function userLoginDetails(userHash, clientId, redirectPath) {
  return dispatch => dispatch({
    types: [USER_LOGIN, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL],
    promise: client => client.get(generateURL(USER_LOGIN_API_KEY, userHash, clientId)).then((result) => {
      const { expires_in, id_token, access_token, user } = result.data;
      localStorage.setItem('userexpiry', expires_in);
      localStorage.setItem('useraccess', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      return result.data;
    }).then(() => window.location.assign(redirectPath))
    .catch((err) => {
      dispatch(updateLoader(false));
      throw err;
    }),
  });
}


export function load() {
  return dispatch => dispatch({
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => new Promise((resolve, reject) => {
      const user = localStorage.getItem('user');
      const userexpiry = localStorage.getItem('userexpiry');
      if (user) {
        const exp = parseInt(userexpiry, 10);
        if (exp > Date.now()) {
          resolve(JSON.parse(user));
        } else {
          reject({ statusCode: 401 });
        }
      } else {
        reject({ statusCode: 401 });
      }
    }),
  });
}

export function refreshToken() {
  return (dispatch) => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [REFRESH, REFRESH_SUCCESS, REFRESH_FAILURE],
      promise: client => client.get(generateURL(REFRESH_API_KEY))
        .then((result) => {
          const { expires_at, token } = result.data;
          const user = JSON.parse(localStorage.getItem('user'));

          user.token = token;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userexpiry', expires_at);
          localStorage.setItem('useraccess', token);
          dispatch(updateLoader(false));

          return user;
        }),
    });
  };
}

export function resetPassword(email) {
  return {
    types: [RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL],
    promise: client => client.post(generateURL(RESET_PASSWORD_API_KEY), {
      data: {
        email,
      },
    }),
  };
}

export function showMessage(messagetype, message) {
  return (dispatch) => {
    setTimeout(() => dispatch({ type: HIDE_NOTIFICATION }), 5000);

    return dispatch({ type: SHOW_NOTIFICATION, messagetype, message });
  };
}
