import { push } from 'react-router-redux';
import { appRoutes, generateURL } from 'config';
import { showMessage } from 'redux/modules/auth';
import { updateLoader } from './loader';
import { browserHistory } from 'react-router';

const LOAD_USERS = 'sterlite/users/LOAD';
const LOAD_USERS_SUCCESS = 'sterlite/users/LOAD_SUCCESS';
const LOAD_USERS_FAILED = 'sterlite/users/LOAD_FAILED';
const LOAD_USERS_API = 'usersLoad';

const GET_USER = 'sterlite/user/GET';
const GET_USER_SUCCESS = 'sterlite/user/GET_SUCCESS';
const GET_USER_FAILED = 'sterlite/user/GET_FAILED';
const GET_USER_API = 'getUserByid';

const ADD_USER = 'sterlite/user/ADD';
const ADD_USER_SUCCESS = 'sterlite/user/ADD_SUCCESS';
const ADD_USER_FAILED = 'sterlite/user/ADD_FAILED';
const ADD_USER_API = 'addUser';

const UPDATE_USER = 'sterlite/users/UPDATE';
const UPDATE_USER_SUCCESS = 'sterlite/users/UPDATE_SUCCESS';
const UPDATE_USER_FAILED = 'sterlite/users/UPDATE_FAILED';
const UPDATE_USER_API = 'updateUser';

const DELETE_USER = 'sterlite/user/DELETE';
const DELETE_USER_SUCCESS = 'sterlite/user/DELETE_SUCCESS';
const DELETE_USER_FAILED = 'sterlite/user/DELETE_FAILED';
const DELETE_USER_API = 'usersDelete';

const LOAD_ALL_USERS = 'sterlite/user/LOAD_ALL';
const LOAD_ALL_USERS_SUCCESS = 'sterlite/user/LOAD_ALL_SUCCESS';
const LOAD_ALL_USERS_FAILED = 'sterlite/user/LOAD_ALL_FAILED';
const LOAD_ALL_USERS_API = 'allUsersLoad';

const LOAD_ALL_CLIENTS = 'auth/clients/LOAD_ALL';
const LOAD_ALL_CLIENTS_SUCCESS = 'auth/clients/LOAD_ALL_SUCCESS';
const LOAD_ALL_CLIENTS_FAILED = 'auth/clients/LOAD_ALL_FAILED';
const LOAD_ALL_CLIENTS_API = 'allClients';

const LOAD_ALL_CLIENTS_ROLE = 'auth/clientsRole/LOAD_ALL';
const LOAD_ALL_CLIENTS_ROLE_SUCCESS = 'auth/clientsRole/LOAD_ALL_SUCCESS';
const LOAD_ALL_CLIENTS_ROLE_FAILED = 'auth/clientsRole/LOAD_ALL_FAILED';
const LOAD_ALL_CLIENTS_ROLE_API = 'allClientsRole';

const ASSIGN_USER = 'sterlite/user/ASSIGN_USER';
const ASSIGN_USER_SUCCESS = 'sterlite/user/ASSIGN_USER_SUCCESS';
const ASSIGN_USER_FAILED = 'sterlite/user/ASSIGN_USER_FAILED';
const ASSIGN_USER_API = 'assignUser';

const LOAD_USER_CLIENTS = 'sterlite/users/LOAD_USER_CLIENTS';
const LOAD_USER_CLIENTS_SUCCESS = 'sterlite/users/LOAD_USER_CLIENTS_SUCCESS';
const LOAD_USER_CLIENTS_FAILED = 'sterlite/users/LOAD_USER_CLIENTS_FAILED';
const LOAD_USER_CLIENTS_API = 'userClientsLoad';

const LOAD_CLIENT_USERS = 'sterlite/users/LOAD_CLIENT_USERS';
const LOAD_CLIENT_USERS_SUCCESS = 'sterlite/users/LOAD_CLIENT_USERS_SUCCESS';
const LOAD_CLIENT_USERS_FAILED = 'sterlite/users/LOAD_CLIENT_USERS_FAILED';
const LOAD_CLIENT_USERS_API = 'clientUsersLoad';

const REMOVE_CLIENT = 'omniaauth/client/REMOVE_CLIENT';
const REMOVE_CLIENT_SUCCESS = 'omniaauth/client/REMOVE_CLIENT_SUCCESS';
const REMOVE_CLIENT_FAILED = 'omniaauth/client/REMOVE_CLIENT_FAILED';
const REMOVE_CLIENT_API = 'removeClients';

const SYNC_USER = 'sterlite/user/SYNC_USER';
const SYNC_USER_SUCCESS = 'sterlite/user/SYNC_USER_SUCCESS';
const SYNC_USER_FAILED = 'sterlite/user/SYNC_USER_FAILED';
const SYNC_USER_API = 'syncUser';

const { clients: { link: usersRoute } } = appRoutes;

const initialState = {
  data: {},
  allUsers: [],
  userClients: {},
  clientUsers: [],
  clients: [],
  allRoles: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        data: action.result,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        data: action.result.data,
      };
    case LOAD_ALL_USERS_SUCCESS:
      return {
        ...state,
        allUsers: action.result.data,
      };
    case LOAD_USER_CLIENTS_SUCCESS:
      return {
        ...state,
        userClients: {
          ...state.userClients,
          [action.key]: action.result,
        },
      };
    case LOAD_CLIENT_USERS_SUCCESS:
      return {
        ...state,
        clientUsers: action.result.data,
      };
    case LOAD_ALL_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: action.result.data,
      };
    case LOAD_ALL_CLIENTS_ROLE_SUCCESS:
      return {
        ...state,
        allRoles: action.result.data,
      };
    default:
      return state;
  }
}

/**
 * Load all users for the current users company
 */
export function loadUsers() {
  return dispatch => dispatch({
    types: [LOAD_USERS, LOAD_USERS_SUCCESS, LOAD_USERS_FAILED],
    promise: client => client.get(generateURL(LOAD_USERS_API))
      .then(result => result.data),
  });
}

/**
 * Load user by Id
 */
export function loadUserById(userId) {
  return (dispatch) => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [GET_USER, GET_USER_SUCCESS, GET_USER_FAILED],
      promise: client => client.get(generateURL(GET_USER_API, userId)).
      then((result) => {
        dispatch(updateLoader(false));
        return result;
      }),
    });
  }
}

/**
 * Create new User
 */
export function addUser(userData, clientId) {
  let data = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    gender: userData.gender,
    date: userData.dob,
    contact: userData.contact,
    nationality: userData.nationality,
    address: userData.address
  }

  data = clientId? Object.assign(data, {client_id: clientId}) : data;
  data = clientId? Object.assign(data, {role_id: userData.role}) : data;

  return dispatch => dispatch({
    types: [ADD_USER, ADD_USER_SUCCESS, ADD_USER_FAILED],
    promise: client => client.post(generateURL(ADD_USER_API), { data }).then((result) => {
      dispatch(showMessage('success', 'User created successfully'));
      browserHistory.goBack();
    }, (error) => {
        dispatch(showMessage('error', error.data));
      }),
  });
}

/**
 * Update existing user
 */
export function updateUser(userId, userData, clientId, redirectUri) {

  let data = { name: userData.name, email: userData.email };
  data = userData.password!= '' ? Object.assign(data, {password: userData.password}) : data;
  data = userData.gender!= '' ? Object.assign(data, {gender: userData.gender}) : data;
  data = userData.dob!= '' ? Object.assign(data, {date: userData.dob}) : data;
  data = userData.contact!= '' ? Object.assign(data, {contact: userData.contact}) : data;
  data = userData.nationality!= '' ? Object.assign(data, {nationality: userData.nationality}) : data;
  data = userData.address!= '' ? Object.assign(data, {address: userData.address}) : data;

  return dispatch => dispatch({
    types: [UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAILED],
    promise: client => client.put(generateURL(UPDATE_USER_API, userId), { data }).then((result) => {
      if (clientId) {
        dispatch(syncToClient(userId, clientId, redirectUri));
      }else {
        browserHistory.goBack();
      }
    }, (error) => {
        dispatch(showMessage('error', error.data));
      }),
  });
}

export function syncToClient(userId, clientId, redirectUri) {
  return dispatch => dispatch({
    types: [SYNC_USER, SYNC_USER_SUCCESS, SYNC_USER_FAILED],
    promise: client => client.get(generateURL(SYNC_USER_API, userId, clientId)).then((result) => {
      if (redirectUri) {
        dispatch(showMessage('success', 'User updated successfully'));
        window.location.assign(redirectUri);
      }else {
        browserHistory.goBack();
      }
    }, (error) => {
        dispatch(showMessage('error', "Error in synchronizing"));
      }),
  });
}
// /**
//  * Delete user
//  */
// export function deleteUser(userId) {
//   return (dispatch, getState) => {
//     const { auth: { user: { company_id: companyId } } } = getState();
//
//     return dispatch({
//       types: [DELETE_USER, DELETE_USER_SUCCESS, DELETE_USER_FAILED],
//       promise: client => client.del(generateURL(DELETE_USER_API, companyId, userId))
//         .then(() => {
//           dispatch(showMessage('success', 'User deleted successfully'));
//           dispatch(push(`/${usersRoute}`));
//         }),
//     });
//   };
// }

/**
 * Get all users
 */
export function loadAllUsers() {
return dispatch => dispatch({
    types: [LOAD_ALL_USERS, LOAD_ALL_USERS_SUCCESS, LOAD_ALL_USERS_FAILED],
    promise: client => client.get(generateURL(LOAD_ALL_USERS_API)),
  });
}
/**
 * Assign user to a company
 */
export function assignUserToCompany(userId, companyId) {
  return dispatch => dispatch({
    types: [ASSIGN_USER, ASSIGN_USER_SUCCESS, ASSIGN_USER_FAILED],
    promise: client => client.post(generateURL(ASSIGN_USER_API), {
      data: {
        user_id: userId,
        company_id: companyId,
      }
    }).then(
      () => dispatch(showMessage('success', 'User assigned successfully')),
      () => dispatch(showMessage('error', 'Failure in assigning the user')))
  });
}

export function loadClientsOfUser(userId) {
return dispatch => dispatch({
    types: [LOAD_USER_CLIENTS, LOAD_USER_CLIENTS_SUCCESS, LOAD_USER_CLIENTS_FAILED],
    promise: client => client.get(generateURL(LOAD_USER_CLIENTS_API, userId)).then(result => result.data),
    key: userId,
  });
}

export function loadClientUsers(clientId) {
  return dispatch => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [LOAD_CLIENT_USERS, LOAD_CLIENT_USERS_SUCCESS, LOAD_CLIENT_USERS_FAILED],
      promise: client => client.get(generateURL(LOAD_CLIENT_USERS_API, clientId))
      .then((result) => {
        dispatch(updateLoader(false));
        return result;
      })
      .catch((err) => {
        dispatch(updateLoader(false));
      }),
    });
  }
}

export function loadAllClients() {
  return dispatch => dispatch({
    types: [LOAD_ALL_CLIENTS, LOAD_ALL_CLIENTS_SUCCESS, LOAD_ALL_CLIENTS_FAILED],
    promise: client => client.get(generateURL(LOAD_ALL_CLIENTS_API)),
  });
}

export function loadAllClientsRoles() {
  return dispatch => dispatch({
    types: [LOAD_ALL_CLIENTS_ROLE, LOAD_ALL_CLIENTS_ROLE_SUCCESS, LOAD_ALL_CLIENTS_ROLE_FAILED],
    promise: client => client.get(generateURL(LOAD_ALL_CLIENTS_ROLE_API)),
  });
}

export function removeClients(userId, clientId, roleId) {

  let data = {
    user_id: userId,
    client_id: clientId,
    role_id: roleId,
  }

  return dispatch => dispatch({
    types: [REMOVE_CLIENT, REMOVE_CLIENT_SUCCESS, REMOVE_CLIENT_FAILED],
    promise: client => client.del(generateURL(REMOVE_CLIENT_API), {data}).then((result) => {
      dispatch(showMessage('success', 'Client Deleted successfully'));
    }, (error) => {
      dispatch(showMessage('error', error.data));
    }),
  });
}
