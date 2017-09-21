const appRoutes = {
  clients: {
    key: 'clients',
    label: 'Clients',
    icon: 'fa-cubes',
    link: 'clients',
    editLink: 'edit',
    viewLink: 'users',
    registerLink: 'register',
    isNav: true,
    hasSubNav: false,
    iconProps: {
      width: 20,
    },
    children: {
      client_users: {
        key: 'clientUsers',
        label: 'Client Users',
        link: 'users',
        showCrumb: true,
      },
    },
  },
  profile: {
    key: 'profile',
    label: 'My Profile',
    icon: 'fa-user',
    link: 'profile',
    isNav: true,
    iconProps: {
      width: 20,
    },
  },
  permission:  {
    isNav: false,
    key: 'permission',
    label: 'Permission',
    icon: 'fa-object-group',
    link: 'permission',
    iconProps: {
      width: 20,
    },
  },
  assign_users: {
    isNav: true,
    key: 'assign',
    label: 'Assign Users',
    icon: 'fa-th-list',
    link: 'assign',
    iconProps: {
      width: 20,
    },
    children: {
      assign: {
        key: 'assign',
        label: 'Assign Clients',
        link: 'assign',
        showCrumb: true,
      },
    },
  },
  users: {
    key: 'users',
    label: 'Add User',
    icon: 'fa-user-plus',
    link: 'users',
    isNav: true,
    iconProps: {
      width: 20,
    },
  },
  auth: {
    key: 'auth',
    label: 'Auth',
    link:'auth',
    isNav: false,
    editLink: 'edit',
    registerLink: 'register',
  },
};

export default appRoutes;
