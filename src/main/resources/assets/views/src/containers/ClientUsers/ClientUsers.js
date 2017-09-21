import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { appRoutes } from 'config';
import Helmet from 'react-helmet';
import DataTable from 'components/DataTable/DataTable';
import { loadClientUsers } from 'redux/modules/users';
import Device from 'components/Device/Device';
import Card from 'components/Card';
import Link from 'components/Link/Link';
import styles from './ClientUsers.scss';
import BreadCrumb from 'components/BreadCrumb/BreadCrumb';

const { object, arrayOf, func } = PropTypes;
const { users: userUrl, clients: clientsUrl } = appRoutes;

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'contact', label: 'Contact' },
  { key: 'role', label: 'Role' },
  { key: 'edit', label: 'Edit' },
];

@connect(state => ({
  clientUsers: state.users.clientUsers,
}),{
  loadClientUsers,
})

export default class ClientUsers extends Component {
  static propTypes = {
    clientUsers: arrayOf(object),
    loadClientUsers: func,

  };

  state = {
    user: '',
  }

  componentWillMount() {
    const {params: {clientId}, loadClientUsers, clientUsers } = this.props;
    if (clientId) {
      loadClientUsers(clientId);
    }
  }
  createRow = (data) => {
    const assetArray = [];

    data.forEach((user) => {
      user.edit = (
        <Link to={`/${userUrl.link}/${user.user_id}`} className={styles.link}>
          <i className="fa fa-edit" />
        </Link>
      );

      assetArray.push(user);
    });

    return assetArray;
  }

  render() {
    const {params: {clientId}, clientUsers } = this.props;
    const userData = this.createRow(clientUsers);
    return (
      <div className={styles.userContainer}>
        <Helmet title="Users" />
        <div className={styles.pageHead}>
          <BreadCrumb className={styles.breadCrumb} pageCrumb={[{ label: clientsUrl.label , to: `/${clientsUrl.link}` }, { label: clientId || '', to: '' }]}  />
        </div>
        {
          (clientUsers.length>0) ?
        <Card>
          <Device rows={clientUsers} cols={columns} type="clientUsers" />
        </Card>
        :
        <label>No user</label>
        }
      </div>
    );
  }
}
