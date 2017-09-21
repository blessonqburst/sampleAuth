import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { appRoutes } from 'config';
import Helmet from 'react-helmet';
import Device from 'components/Device/Device';
import Card, { CardHeader } from 'components/Card';
import Modal from 'components/Model/Model';
import Link from 'components/Link/Link';
import MenuButton from 'components/MenuButton/MenuButton';
import classnames from 'classnames';
import BreadCrumb from 'components/BreadCrumb/BreadCrumb';
import { loadClients, generateToken } from 'redux/modules/clients';

import styles from './Clients.scss';

const { object, arrayOf, func } = PropTypes;

const { clients: clientUrl } = appRoutes;
const cols = [
  { key: 'serial_no', label: '#' },
  { key: 'client_name', label: 'Name' },
  { key: 'permission_uri', label: 'Permission URI' },
  { key: 'redirect_uri', label: 'Redirect URI' },
  { key: 'user_count', label: 'Users Count' },
  { key: 'created_by', label: 'Created By' },
  { key: 'createdDt', label: 'Created On' },
  { key: 'edit', label: 'Edit' },
];

@connect(state => ({
  user: state.auth.user,
  clientsList: state.clients.data,
  token: state.clients.token,
}), {
  loadClients, generateToken,
})
export default class Clients extends Component {
  static propTypes = {
    loadClients: func,
    generateToken: func,
    clientsList: arrayOf(object),
    token: object,
    user: object,
  }

  static contextTypes = {
    router: object,
    i18n: object,
  };

  state = {
    show: false,
    heading: '',
    item: {},
    copied: false,
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.token !== this.props.token) {
      const { item } = this.state;
      item.value = nextProps.token.access_token;
      this.setState({show: true, item, heading: 'Use this Token' });
    }
  }

  componentDidMount() {
    this.props.loadClients(this.props.user.id);
  }


  createRow = (data) => {
    const assetArray = [];

    data.forEach((client) => {
      const dateTime = new Date(client.created_dt);
      client.viewUser = (
        <Link to={`${clientUrl.link}/${clientUrl.viewLink}/${client.client_name}`} className={styles.link}>
          <i className="fa fa-user" />
        </Link>
      );
      client.viewSecret = (
        <span className={styles.viewLink} onClick={this.handleViewSecret(client)}>
          <i className="fa fa-key" aria-hidden="true"/>
        </span>
      );
      client.generateToken = (
        <span className={styles.viewLink} onClick={this.generateToken(client)}>
          <i className="fa fa-plus" aria-hidden="true"/>
        </span>
      );
      client.createdDt = dateTime.getDate() + '/' + dateTime.getMonth() + '/' + dateTime.getFullYear();
      client.edit = (
        <Link to={`/${clientUrl.link}/${clientUrl.registerLink}/${client.client_name}`} className={styles.link}>
          <i className="fa fa-edit" />
        </Link>
      );
      assetArray.push(client);
    });

    return assetArray;
  }

  handleViewUser = item => (event) => {
    const { router } = this.context;
    event.stopPropagation();
    router.push(`/${clientUrl.link}/${clientUrl.viewLink}/${item.client_name}`);
  };

  handleViewSecret = item => (event) => {
    item.value = item.client_secret;
    this.setState({show: true, item, heading: 'Secret-Code' });
    setTimeout(() => {
      this.setState({show: false, item, heading: '', copied: false });
    }, 3000);
  };

  generateToken = item => (event) => {
    this.props.generateToken(this.props.user.id, item.client_name);
  }

  copyClipboard = item => () => {
    var textField = document.createElement('textarea');
    textField.innerText = item;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    this.setState({copied: true})
  }

  cancelDialog = () => this.setState({ show: false, copied: false });

  render() {
    const commons = {
      headers: [
        {
          label: 'View Secret', key: 'secret'
        },
        {
          label: 'View Users', key: 'view'
        },
        {
          label: 'Generate Token', key: 'token'
        }
      ],
      cells: {
        secret: item => (
          <div className={styles.viewLink} onClick={this.handleViewSecret(item)}>
            <i className="fa fa-key" aria-hidden="true"/>
          </div>
        ),
        view: item => (
          <div className={styles.viewLink} onClick={this.handleViewUser(item)}>
            <i className="fa fa-user" aria-hidden="true" />
          </div>
        ),
        token: item => (
          <div className={styles.viewLink} onClick={this.generateToken(item)}>
            <i className="fa fa-plus" aria-hidden="true"/>
          </div>
        ),
      },
    };

    const clientData = this.createRow(this.props.clientsList);
    const { secretValue, show, item, heading } = this.state;
    return (
      <div className={styles.userContainer}>
        <Helmet title="Clients" />
        <div className={styles.pageHead}>
          <BreadCrumb className={styles.breadCrumb} skipLevel={1} />
          <Link label="Register Client" to={`/${clientUrl.link}/${clientUrl.registerLink}`} className={styles.registerClient} />
        </div>
        <Card>
          <Device rows={clientData} cols={cols} type="client" common={commons}/>
        </Card>
        <Modal heading ={heading} show={show} showHeader={true} close={this.cancelDialog} >
          <input type="text" defaultValue={item.value} id="clipboard" className={styles.clipBoard} readOnly/>
          <button onClick={this.copyClipboard(item.value) }>
            <i className="fa fa-clipboard" aria-hidden="true"/>
          </button>
          {this.state.copied ? <span className={styles.clipBoardButton}>Copied</span> : null}
        </Modal>
      </div>);
  }
}
