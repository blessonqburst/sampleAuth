/**
 * This configuration is expected to be received from api call
 */

import appRoutes from './routes';

const { clients, permission, assign_users, profile, users } = appRoutes;

const access = {
  'Super-User': {
    root: `/${clients.link}`,
  },
  'Default': {
    root: `/${profile.link}`,
    restrictions: [
      clients.key,
      permission.key,
      users.key,
      assign_users.key,
    ],
  },
  'Company-Admin': {
    root: `/${profile.link}`,
    restrictions: [
      clients.key,
      permission.key,
      users.key,
      assign_users.key,
    ],
  },
  Inspector: {
    root: `/${profile.link}`,
    restrictions: [

    ],
  },
};

export default access;
