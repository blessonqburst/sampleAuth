import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { appRoutes } from 'config';
import Device from 'components/Device/Device';
import DropDown, { DropDownItem } from 'components/DropDown/DropDown';
import BreadCrumb from 'components/BreadCrumb/BreadCrumb';
import Link from 'components/Link/Link';
import { loadAllUsers, loadClientsOfUser, removeClients } from 'redux/modules/users';
import { updateLoader } from 'redux/modules/loader';

const { object, arrayOf, func } = PropTypes;
const { assign_users: assignUsers } = appRoutes;
const {  children: { assign } } = assignUsers;

import styles from './AssignUser.scss';
const columns = [
  { key: 'client_name', label: 'Client Name' },
  { key: 'role_description', label: 'Role' },
];
@connect(state => ({
  users: state.users,
  allUsers: state.users.allUsers,
  userClients: state.users.userClients,
}),
{
  loadUsers: loadAllUsers,
  showLoader: updateLoader,
  loadClients: loadClientsOfUser,
  removeClients,
})

export default class AssignUser extends Component {

  static propTypes = {
    allUsers: arrayOf(object),
    userClients: object,
    loadUsers: func,
    showLoader: func,
    loadClients: func,
    removeClients: func,
  };

  state = {
    user: '',
  }

  componentWillMount() {
    const { loadUsers, showLoader } = this.props;
    showLoader(true);
    loadUsers();
  }

  componentDidMount() {
    const { allUsers, showLoader } = this.props;
    if(allUsers) {
      showLoader(false);
    }
  }

  handleChange = name => (event) => {
    const { value } = event.target;
    if (name === 'user' && value) {
      const { allUsers, userClients, loadClients } = this.props;
      const clientsOfUser = userClients[value];
      if (!clientsOfUser || !clientsOfUser.length) {
        loadClients(value);
      }
    }
    this.setState({ [name]: value });
  }

// use this for implementing Edit functionality in future
  handleEdit = item => (event) => {
    // edit: item => (
    //   <div className={styles.editLink} onClick={this.handleEdit(item)} disabled>
    //     <i className="fa fa-pencil-square-o" aria-hidden="true"/>
    //   </div>
    // ),
    console.log(item);
  }

  handleRemove = item => (event) => {
    const { user } = this.state;
    const { client_id, role_id } = item;
    const { removeClients, loadClients } = this.props;
    removeClients(user, client_id, role_id).then(() => loadClients(user));
  }

  render () {
    const { allUsers, userClients } = this.props;
    const { user } = this.state;
    const clientsOfUser = userClients[user];
    const commons = {
      headers: [
        {
          label: 'Remove', key: 'remove'
        }
      ],
      cells: {
        remove: item => (
          <div className={styles.removeLink} onClick={this.handleRemove(item)}>
            <i className="fa fa-trash-o" aria-hidden="true" />
          </div>
        )
      },
    };
    return (
      <div className={styles.assetContainer}>
        <Helmet title={assignUsers.label} />
        <div className={styles.pageHead}>
          <BreadCrumb className={styles.breadCrumb} skipLevel={1} />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.formHead}>
            <DropDown name="user" heading="User:" onChange={this.handleChange('user')} className={styles.dropDown}>
              <DropDownItem label="Select" value="" className={styles.dropDownItem}/>
              {
                allUsers.map(({ name, user_id: userId }) =>
                  <DropDownItem value={userId} key={userId} label={name} />
                )
              }
            </DropDown>
            {
                (user) ? <Link label="Assign Clients" to={`${assignUsers.link}/${user}`} className={styles.assignClient} /> : null
            }
          </div>
          <div>
            {
              clientsOfUser ?
              (
                <div>
                  <Device cols={columns} rows={clientsOfUser} type="user_clients" common={commons}/>
                  {
                  (clientsOfUser.length <= 0) ?
                    <div className={styles.Nolabel}>
                      <label> No clients Registered</label>
                    </div> : null
                  }
                </div>
              ): null
            }
          </div>
        </div>
      </div>
    );
  }
}
