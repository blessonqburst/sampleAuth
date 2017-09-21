/**
 * Library dependency
 */
import React from 'react';
import { Route } from 'react-router';

/**
 * App dependency
 */
import { access, appRoutes } from 'config';

/**
 * Set of container components used for configuring routes
 */
import App from 'containers/App/App';
import Clients from 'containers/Clients/Clients';
import Profile from 'containers/Profile/Profile';
import AssignUser from 'containers/AssignUser/AssignUser';
import AssignUserNew from 'containers/AssignUser/AssignUserNew';
import NotFound from 'containers/NotFound/NotFound';
import ClientUsers from 'containers/ClientUsers/ClientUsers';
import UserForm from 'containers/User/UserForm';
import ClientForm from 'containers/Clients/ClientForm';
/**
 * Redux modules
 */
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';

const { clients, users, profile, assign_users: assignUser, auth } = appRoutes;

const { client_users: clientsUsers } = clients.children;

/**
 * Validates whether the user have access to current route.
 */
const hasAccess = (collection, path, restrictions) => {
  const routeKeys = Object.keys(collection);
  let accessible = true;

  if (restrictions.length) {
    routeKeys.forEach((key) => {
      const { link, children } = collection[key];

      if (path.indexOf(link) !== -1) {
        if (restrictions.indexOf(key) !== -1) {
          accessible = false;
        } else if (children) {
          accessible = accessible && hasAccess(children, path, restrictions);
        }
      }
    });
  }

  return accessible;
};

export default (store) => {
  /**
   * Ensurses the routes are server to the logged in user who has access
   */
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      const nextPath = nextState.location.pathname;

      if (user && nextPath === '/') {
        const { root } = access[user.role];

        replace(root);
      } else if (!user && nextPath !== '/') {
        store.dispatch(logout());
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth, checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Validates whether the user have access to current route.
   */
  const ensureAccess = (nextState, replace, cb) => {
    const { auth: { user } } = store.getState();
    const nextPath = nextState.location.pathname;

    if (user && nextPath !== '/') {
      const { restrictions = [], root } = access[user.role];

      if (!hasAccess(appRoutes, nextPath, restrictions)) {
        replace(root);
      }
    }
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
      <Route path="/" component={App} onEnter={requireLogin}>
        <Route path={`${clients.link}`} component={Clients} status={200} onEnter={ensureAccess} />
        <Route path={`${profile.link}`} component={Profile} status={200} onEnter={ensureAccess} />
        <Route path={`${assignUser.link}`} component={AssignUser} status={200} onEnter={ensureAccess} />
        <Route path={`${assignUser.link}/:userId`} component={AssignUserNew} status={200} onEnter={ensureAccess} />
        <Route path={`${users.link}/:userId`} component={UserForm} status={200} onEnter={ensureAccess} />
        <Route path={`${clients.link}/${clientsUsers.link}/:clientId`} component={ClientUsers} status={200} onEnter={ensureAccess} />
        <Route path={`${users.link}`} component={UserForm} status={200} />
        <Route path={`${clients.link}/${clients.registerLink}`} component={ClientForm} status={200} />
        <Route path={`${clients.link}/${clients.registerLink}/:clientId`} component={ClientForm} status={200} />
        <Route path={`${auth.link}/${auth.registerLink}`} component={UserForm} status={200} />
        <Route path={`${auth.link}/${auth.editLink}/:userId`} component={UserForm} status={200} />
        <Route path="*" component={NotFound} status={404} />
      </Route>
  );
};
