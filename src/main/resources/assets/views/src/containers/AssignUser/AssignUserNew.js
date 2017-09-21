import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { appRoutes } from 'config';
import TextContainer from 'components/TextContainer/TextContainer';
import Device from 'components/Device/Device';
import DropDown, { DropDownItem } from 'components/DropDown/DropDown';
import BreadCrumb from 'components/BreadCrumb/BreadCrumb';
import MenuButton from 'components/MenuButton/MenuButton';
import Link from 'components/Link/Link';
import { updateLoader } from 'redux/modules/loader';
import { loadAllClients,loadAllClientsRoles,loadClientsOfUser } from 'redux/modules/users';
import { addNewClientToUser } from 'redux/modules/clients';

import { getObject, getClients } from 'utils/filters';


const { object, arrayOf, func } = PropTypes;
const { assign_users: assignUsers } = appRoutes;
const {  children: { assign } } = assignUsers;
const followUps = { clientId: { roleId: '' }};

import styles from './AssignUser.scss';

@connect(state => ({
  user: state.auth.user,
  clients: state.users.clients,
  allRoles: state.users.allRoles,
  userClients: state.users.userClients,
}),
{
  showLoader: updateLoader,
  addNewClientToUser,
  loadAllClients,
  loadAllClientsRoles,
  loadClients: loadClientsOfUser,
})

export default class AssignUserNew extends Component {

  static propTypes = {
    addNewClientToUser: func,
    loadAllClients: func,
    loadAllClientsRoles: func,
    loadClients: func,
    showLoader: func,
    userClients: object,
    user: object,
  };

  static contextTypes = {
    router: object,
  };

  state = {
    user: '',
  }

  componentWillMount() {

    const { params: {userId}, showLoader, loadAllClients, loadAllClientsRoles, loadClients, userClients } = this.props;
    showLoader(true);
    loadAllClients();
    loadAllClientsRoles();
    if(!userClients[userId]) {
      loadClients(userId);
    }
  }

  componentDidMount() {
    const { params: {userId}, showLoader, loadAllClients, loadAllClientsRoles } = this.props;
    if(userId) {
      showLoader(false);
      loadAllClients();
      loadAllClientsRoles();
    }
  }

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let newValue = value;
    this.setState({ [name]: newValue, ...followUps[name]});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { params: {userId}, user, addNewClientToUser, loadClients } = this.props;
    const { clientId, roleId } = this.state;

    addNewClientToUser(userId, clientId, roleId, user.user_id).then(() => loadClients(userId) );


  };

  cancelAssign = () => this.context.router.push(`/${assignUsers.link}`);

  render () {
    const { params: {userId}, clients, allRoles, userClients } = this.props;
    const { clientId, roleId } = this.state;
    const selectedClients = getClients(clients, userClients[userId]);
    const selectedClient = getObject(selectedClients, clientId, '_id');
    const selectedRole = selectedClient && selectedClient.length ? getObject(allRoles, selectedClient[0]._id, 'client_id') : null;
    const dropdownObj = { onChange: this.handleChange, appendDefault: true, className: styles.ddContainer, required: true };

    return (
      <div className={styles.assignContainer}>
        <Helmet />
        <div className={styles.pageHead}>
          <BreadCrumb className={styles.breadCrumb} pageCrumb={[{ label: assignUsers.label , to: `/${assignUsers.link}` }, { label: userId || '', to: '' }]}/>
        </div>
        <form className={styles.formContainer} onSubmit={this.handleSubmit} disabled={!selectedRole} role="form" name="form" >
          <div className={styles.majorFormControl} >
            <DropDown name="clientId" heading="Clients" disabled={!selectedClients} defaultValue={clientId} {...dropdownObj}>
              {
                selectedClients ? selectedClients.map(({ client_identity: clientName, _id: clientId }) =>
                  <DropDownItem value={clientId} key={clientId} label={clientName} />
                ) : null
              }
            </DropDown>
            <DropDown name="roleId" heading="Roles" disabled={!selectedRole} defaultValue={roleId} {...dropdownObj}>
              {
                selectedRole && selectedRole.map(({ role_description: roleName, role_id: roleId }) =>
                  <DropDownItem value={roleId} key={roleId} label={roleName} />
                )
              }
            </DropDown>
          </div>
          <div className={styles.assignAction}>
            <MenuButton label="SUBMIT" type="submit" />
            <MenuButton label="CANCEL" onClick={this.cancelAssign} className={styles.warning}/>
          </div>
        </form>
      </div>
    );
  }
}
