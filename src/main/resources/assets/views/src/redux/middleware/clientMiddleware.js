// import { logout } from 'redux/modules/auth';
import { showMessage } from 'redux/modules/auth';

export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare

    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    const actionPromise = promise(client);

    actionPromise.then(
      result => next({ ...rest, result, type: SUCCESS }),
      (error) => {
        // if (error && error.statusCode === 401) {
        //  next(logout(error.data));
        // } else {
        if (error && error.data) {
          next(showMessage('error', error.data));
        }
        next({ ...rest, error, type: FAILURE });
        // }
      }
    ).catch((error) => {
      console.error('MIDDLEWARE ERROR:', error); // eslint-disable-line no-console
      next({ ...rest, error, type: FAILURE });
    });

    return actionPromise;
  };
}
