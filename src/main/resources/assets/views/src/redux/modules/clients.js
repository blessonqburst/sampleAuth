import { appRoutes, generateURL } from 'config';
import { updateLoader } from './loader';
import { showMessage } from 'redux/modules/auth';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';

const LOAD_CLIENTS = 'omniaauth/clients/LOAD';
const LOAD_CLIENTS_SUCCESS = 'omniaauth/clients/LOAD_SUCCESS';
const LOAD_CLIENTS_FAILED = 'omniaauth/clients/LOAD_FAILED';
const LOAD_CLIENTS_API = 'loadClients';

const GENERATE_TOKEN = 'omniaauth/token/GENERATE';
const GENERATE_TOKEN_SUCCESS = 'omniaauth/token/GENERATE_SUCCESS';
const GENERATE_TOKEN_FAILED = 'omniaauth/token/GENERATE_FAILED';
const GENERATE_TOKEN_API = 'generateToken';

const GET_CLIENT = 'omniaauth/clients/GET_CLIENT';
const GET_CLIENT_SUCCESS = 'omniaauth/clients/GET_CLIENT_SUCCESS';
const GET_CLIENT_FAILED = 'omniaauth/clients/GET_CLIENT_FAILED';
const GET_CLIENT_API = 'loadClientById';

const ADD_CLIENT = 'omniaauth/clients/ADD';
const ADD_CLIENT_SUCCESS = 'omniaauth/clients/ADD_SUCCESS';
const ADD_CLIENT_FAILED = 'omniaauth/clients/ADD_FAILED';
const ADD_CLIENT_API = 'registerClient';

const UPDATE_CLIENT = 'omniaauth/clients/UPDATE';
const UPDATE_CLIENT_SUCCESS = 'omniaauth/clients/UPDATE_SUCCESS';
const UPDATE_CLIENT_FAILED = 'omniaauth/clients/UPDATE_FAILED';
const UPDATE_CLIENT_API = 'updateClient';

const GET_USER = 'sterlite/user/GET';
const GET_USER_SUCCESS = 'sterlite/user/GET_SUCCESS';
const GET_USER_FAILED = 'sterlite/user/GET_FAILED';
const GET_USER_API = 'getUserByid';

const ADD_USER_CLIENT = 'omniaauth/userClient/ADD';
const ADD_USER_CLIENT_SUCCESS = 'omniaauth/userClient/ADD_SUCCESS';
const ADD_USER_CLIENT_FAILED = 'omniaauth/userClient/ADD_FAILED';
const ADD_USER_CLIENT_API = 'addNewClientToUser';

const GET_CLIENT_ROLES = 'omniaauth/clients/GET_CLIENT_ROLES';
const GET_CLIENT_ROLES_SUCCESS = 'omniaauth/clients/GET_CLIENT_ROLES_SUCCESS';
const GET_CLIENT_ROLES_FAILED = 'omniaauth/clients/GET_CLIENT_ROLES_FAILED';
const GET_CLIENT_ROLES_API = 'loadClientRoles';

const initialState = {
  data: [],
  token: {},
  client: {},
  clientRoles: [],
};

const { assign_users: { link: assignUserRoute } } = appRoutes;

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_CLIENTS:
    case GENERATE_TOKEN:
      return {
        ...state,
      };
    case LOAD_CLIENTS_SUCCESS:
      return {
        ...state,
        data: action.result.map((user, index) => ({ ...user, serial_no: index + 1 })),
      };
    case GENERATE_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.result,
      };
    case LOAD_CLIENTS_FAILED:
    case GENERATE_TOKEN_FAILED:
      return {
        ...state,
      };
    case GET_CLIENT_SUCCESS:
      return {
        ...state,
        client: action.result,
      };
    case GET_CLIENT_ROLES_SUCCESS:
      return {
        ...state,
        clientRoles: action.result,
      }
    default:
      return state;
  }
}

export function loadClients(userId) {
  return (dispatch) => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [LOAD_CLIENTS, LOAD_CLIENTS_SUCCESS, LOAD_CLIENTS_FAILED],
      promise: client => client.get(generateURL(LOAD_CLIENTS_API, userId))
      .then((result) => {
        dispatch(updateLoader(false));
        return result;
      })
      .catch((err) => {
        dispatch(updateLoader(false));
        throw err;
      }),
    });
  };
}

export function generateToken(userId, clientId) {
  return (dispatch) => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [GENERATE_TOKEN, GENERATE_TOKEN_SUCCESS, GENERATE_TOKEN_FAILED],
      promise: token => token.post(generateURL(GENERATE_TOKEN_API, userId, clientId))
      .then((result) => {
        dispatch(updateLoader(false));
        return result.data;
      })
      .catch((err) => {
        dispatch(updateLoader(false));
        throw err;
      }),
    });
  };
}

export function loadClientById(clientId) {
  return (dispatch) => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [GET_CLIENT, GET_CLIENT_SUCCESS, GET_CLIENT_FAILED],
      promise: client => client.get(generateURL(GET_CLIENT_API, clientId)).
      then((result) => {
        dispatch(updateLoader(false));
        return result.data;
      }),
    });
  }
}

export function addClient(clientData) {
  let data = {
    name: clientData.name,
    secret: clientData.secret,
    redirect_uri: clientData.redirect_uri,
    permission_uri: clientData.permission_uri,
  }

  return dispatch => dispatch({
    types: [ADD_CLIENT, ADD_CLIENT_SUCCESS, ADD_CLIENT_FAILED],
    promise: client => client.post(generateURL(ADD_CLIENT_API), {data}).then((result) => {
      dispatch(showMessage('success', 'Client created successfully'));
      browserHistory.goBack();
    }, (error) => {
      dispatch(showMessage('error', error.data));
    }),
  });
}

/**
 * Update existing client
 */
export function updateClient(clientId, clientData) {
  let data = { name: clientData.name };
  data = clientData.secret!= '' ? Object.assign(data, {secret: clientData.secret}) : data;
  data = clientData.redirect_uri!= '' ? Object.assign(data, {redirect_uri: clientData.redirect_uri}) : data;
  data = clientData.permission_uri!= '' ? Object.assign(data, {permission_uri: clientData.permission_uri}) : data;

  return dispatch => dispatch({
    types: [UPDATE_CLIENT, UPDATE_CLIENT_SUCCESS, UPDATE_CLIENT_FAILED],
    promise: client => client.put(generateURL(UPDATE_CLIENT_API, clientId), { data }).then((result) => {
      dispatch(showMessage('success', 'Client updated successfully'));
      browserHistory.goBack();
    }, (error) => {
        dispatch(showMessage('error', error.data));
      }),
    });
}

export function addNewClientToUser(userId, clientId, roleId, createdBy) {
  return dispatch => dispatch({
    types: [ADD_USER_CLIENT, ADD_USER_CLIENT_SUCCESS, ADD_USER_CLIENT_FAILED],
    promise: client => client.post(generateURL(ADD_USER_CLIENT_API), {
       data: {
         user_id: userId,
         client_id: clientId,
         role_id: roleId,
         created_by: createdBy,
       }
    }).then(
      () => {
        dispatch(showMessage('success', 'New Client and Role Assigned successfully'));
        dispatch(push(`/${assignUserRoute}`));
      },
      () => dispatch(showMessage('error', 'Failure in assigning the user'))),
  });
}

export function loadClientRoles(clientId) {
  return (dispatch) => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [GET_CLIENT_ROLES, GET_CLIENT_ROLES_SUCCESS, GET_CLIENT_ROLES_FAILED],
      promise: client => client.get(generateURL(GET_CLIENT_ROLES_API, clientId)).
      then((result) => {
        dispatch(updateLoader(false));
        return result.data;
      }, (error) => {
          dispatch(showMessage('error', error.data));
      }),
    });
  }
}
