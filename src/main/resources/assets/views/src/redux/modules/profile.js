import { generateURL } from 'config';
import { updateLoader } from './loader';

const LOAD_PROFILE = 'omniaauth/profile/LOAD';
const LOAD_PROFILE_SUCCESS = 'omniaauth/profile/LOAD_SUCCESS';
const LOAD_PROFILE_FAILED = 'omniaauth/profile/LOAD_FAILED';
const LOAD_PROFILE_API = 'loadProfile';

const initialState = {
  data: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_PROFILE:
      return {
        ...state,
      };
    case LOAD_PROFILE_SUCCESS:

      return {
        ...state,
        data: action.result,
      };
    case LOAD_PROFILE_FAILED:
      return {
        ...state,
      };
    default:
      return state;
  }
}

export function loadProfile(userId) {
  return (dispatch) => {
    dispatch(updateLoader(true));

    return dispatch({
      types: [LOAD_PROFILE, LOAD_PROFILE_SUCCESS, LOAD_PROFILE_FAILED],
      promise: client => client.get(generateURL(LOAD_PROFILE_API, userId))
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
