/**
 * Api server enpoint
 */
export const cmsBase = 'http://inspector-admin.seemymachines.com/api';
export const adminApiBase = 'http://dev.seemymachines.com:6060/api';
export const authBase = 'http://dev.seemymachines.com:6060';
export const authClientBase = `${adminApiBase}/auth/auth?response_type=code&client_id=default_client&scope=openid&redirect_uri=${authBase}`;

// export const adminApiBase = 'http://localhost:8080/v1';

/**
 * Preview
 */
const preview = {
  previewCMS: `${cmsBase}/docs/preview/{0}`,
};

/**
 * adminApi
 */
const admin = {
  authLogin: `${adminApiBase}/auth/login`,
  getToken: `${adminApiBase}/auth/token`,
  getLogin: authClientBase,
  getUserDetails: `${adminApiBase}/user/%d/details?client_id=default_client`,
  loadClients: `${adminApiBase}/user/clients/{0}`,
  loadProfile: `${adminApiBase}/user/{0}`,
  generateToken: `${adminApiBase}/user/token/{0}/{1}`,
  allUsersLoad: `${adminApiBase}/users`,
  allClients: `${adminApiBase}/clients`,
  allClientsRole: `${adminApiBase}/client/roles?all_clients=1`,
  userClientsLoad: `${adminApiBase}/client/users/{0}`,
  clientUsersLoad: `${adminApiBase}/users?clientId={0}`,
  getUserByid: `${adminApiBase}/user/{0}`,
  updateUser: `${adminApiBase}/user/{0}`,
  registerClient: `${adminApiBase}/client`,
  addUser: `${adminApiBase}/user`,
  loadClientById: `${adminApiBase}/client/{0}`,
  updateClient: `${adminApiBase}/client/{0}`,
  addNewClientToUser: `${adminApiBase}/user/client/role`,
  loadClientRoles: `${adminApiBase}/client/roles?client_id={0}`,
  userLoginDetails: `${adminApiBase}/user/login/details?hash={0}&client_id={1}`,
  syncUser: `${adminApiBase}/user/{0}/role/sync?client_id={1}`,
  removeClients: `${adminApiBase}/user/permission`,
};

const users = {
  usersLoad: '/v1/user',
  usersCreate: '/v1/company/{0}/user',
  usersById: '/v1/user/{0}',
  usersUpdate: '/v1/company/{0}/user/{1}',
  usersDelete: '/v1/company/{0}/user/{1}',
  assignUser: '/v1/user/assign_company',
}

/**
 * dynamic URL SAMPLE
 */
/*
const machine = {
  machineTickets: {
    base: '/tickets?',
    params: ['start', 'count', 'machine_id', 'status'],
  },
};
*/

// All endpoints
const endPoints = {
  ...preview,
  ...admin,
  ...users,
};

export const generateURL = (key, ...params) => {
  let url = endPoints[key];
  const isDynamic = typeof url === 'object';
  const dynamicParams = isDynamic && url.params;

  url = isDynamic && url.base || url;

  if (params.length) {
    params.forEach((param, index) => {
      const connection = index === 0 ? '' : '&';

      if (param === undefined || param === null) {
        return;
      }
      url = isDynamic ? `${url}${connection}${dynamicParams[index]}=${param}` : url.replace(`{${index}}`, param);
    });
  }

  return url;
};
