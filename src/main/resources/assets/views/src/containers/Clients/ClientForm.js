import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { appRoutes } from 'config';
import Helmet from 'react-helmet';
import styles from './Clients.scss';
import DateTime from 'react-datetime';
import DropDown, { DropDownItem } from 'components/DropDown/DropDown';
import TextContainer from 'components/TextContainer/TextContainer';
import MenuButton from 'components/MenuButton/MenuButton';
import Link from 'components/Link/Link';
import classnames from 'classnames';
import { loadClientById, updateClient, addClient } from 'redux/modules/clients';
import { browserHistory } from 'react-router';

const { func, object } = PropTypes;
const { clients: clientUrl } = appRoutes;

const initialState = {
  name: '',
  secret: '',
  redirect_uri: '',
  permission_uri: '',
};

@connect(state => ({
  client: state.clients.client,
}),
{
  loadClientById,
  updateClient,
  addClient
})

export default class ClientForm extends Component {
  static propTypes = {
    loadClientById: func,
    client: object,
    updateClient: func,
    addClient: func,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    ...initialState,
  };

  componentWillMount() {
    const {params: {clientId}, loadClientById } = this.props;
    if (clientId) {
        loadClientById(clientId);
    }
  }

  componentWillReceiveProps(nextProps) {
      const { params: { clientId }, client } = nextProps;
      if(clientId) {
        this.setState({
          name: client.client_identity,
          secret: client.client_secret,
          redirect_uri: client.redirect_uri,
          permission_uri: client.permission_uri,
        });
      } else {
        this.setState({
          ...initialState,
        });
      }
  }

  handleChange = name => event => {
    const { value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    const { params: { clientId }, addClient, updateClient } = this.props;
    event.preventDefault();
    if (clientId) {
      updateClient(clientId, {...this.state});
    } else {
      addClient({...this.state});
    }
  }

  goToPreviousLocation = (event) => {
    event.preventDefault();
    browserHistory.goBack();
  }

  render() {
    const { params: {clientId} } = this.props;
    const { name, secret, redirect_uri, permission_uri } = this.state;
    return (
      <div className={styles.loginWrapper}>
        <Helmet title={ clientId ? 'EDIT CLIENT' : 'ADD CLIENT' } />
          <form className={styles.loginForm} name="form" role="form" onSubmit={this.handleSubmit}>
            <div className={styles.loginHead}>{ clientId ? 'EDIT CLIENT' : 'ADD CLIENT' }</div>
            <div className={styles.formContainer}>
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label='Name'
                onChange={this.handleChange('name')}
                value={name}
                required
              />
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label="Secret"
                type='password'
                onChange={this.handleChange('secret')}
                value={secret}
                required={!clientId}
              />
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label='Redirect URI'
                onChange={this.handleChange('redirect_uri')}
                value={redirect_uri}
                required={!clientId}
              />
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label={'Permission URI'}
                onChange={this.handleChange('permission_uri')}
                value={permission_uri}
                required={!clientId}
              />
              <div className={styles.buttonContainer}>
                <MenuButton
                  label={clientId ? 'Update' : 'Submit'}
                  className={styles.loginBtn}
                  type='submit'
                />
                <MenuButton
                  label="Cancel"
                  className={classnames(styles.loginBtn, styles.cancel)}
                  type='button'
                  onClick={this.goToPreviousLocation}
                />
              </div>
            </div>
          </form>
      </div>
    );
  }
}
