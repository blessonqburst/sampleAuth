import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import classnames from 'classnames';
import { access, mobileWidth, authBase } from 'config';
import translation from 'i18n';
import Login from 'containers/Login';
import NavBar from 'components/NavBar/NavBar';
import NavDrawer from 'components/NavDrawer/NavDrawer';
import Loader from 'components/Loader/Loader';
import Notification from 'components/Notification/Notification';
import { logout, login, refreshToken, getToken, getLogin, userLoginDetails } from 'redux/modules/auth';
import styles from './App.scss';

const { object, func } = PropTypes;

@connect(
  state => ({ user: state.auth.user, notification: state.auth.notification }),
  { logout, login, refreshToken, getToken, getLogin, pushState: push, userLoginDetails })
export default class App extends Component {
  static propTypes = {
    children: object,
    getToken: func,
    getLogin: func,
    location: object,
    login: func.isRequired,
    logout: func.isRequired,
    notification: object,
    pushState: func.isRequired,
    refreshToken: func.isRequired,
    userLoginDetails: func,
    user: object,
  };

  static contextTypes = {
    store: object.isRequired
  };

  static childContextTypes = {
    user: object.isRequired,
    i18n: object,
    location: object,
  };

  state = {
    showLoader: false,
    drawerOpen: true,
  };

  getChildContext() {
    return {
      user: this.props.user || {},
      i18n: translation,
      location: this.props.location,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(access[nextProps.user.role].root);
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  refreshRequestedTime = Date.now();

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  handleActiveState = () => {
    // const { user } = this.props;
    //
    // // Refresh token requested in last 20 seconds.
    // // So no immediate request
    // if (Date.now() - this.refreshRequestedTime < 20000) return;
    // if (user && user.expires_at) {
    //   if (user.expires_at - Date.now() < 5000) {
    //     this.refreshRequestedTime = Date.now();
    //     this.props.refreshToken();
    //   } else if (user.expires_at - Date.now() < 0) {
    //     this.props.logout();
    //   }
    // }
  };

  resizeWindow = () => {
    const width = window.innerWidth;

    if (width > mobileWidth) {
      this.setState({
        drawerOpen: true,
      });
    } else {
      this.setState({
        drawerOpen: false
      });
    }
  }

  openNav = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  render() {
    const { user, location, notification } = this.props;
    const { drawerOpen } = this.state;
    const activeIndicator = {
      onMouseMove: this.handleActiveState,
      onKeyPress: this.handleActiveState,
    };
    const drawerOpenClass = !drawerOpen ? null : styles.drawerOpen;
    if (!user) {
      if(location.pathname.search("auth/login") > 0 || location.query.errorMsg) {
        return <Login login={this.props.login} query={location.query}/>
      }
      else if(location.query.code) {
        console.log("entered here");
        console.log("authBase is ", authBase);
        const loginData = {
          code: location.query.code,
          grant_type: 'authorization_code',
          redirect_uri: authBase,
        };
        return this.props.getToken(loginData);
      } else if(location.query.hash && location.query.client_id) {
        const pathname = location.pathname.concat("?client_id=",location.query.client_id,"&redirect_uri=",location.query.redirect_uri);
        return this.props.userLoginDetails(location.query.hash, location.query.client_id, pathname);
      }
      else
        return this.props.getLogin();
    }

    return (
      <div className={styles.containerHeight}>
        <Notification {...notification} />
        <NavDrawer openDrawer={drawerOpen} location={location} logout={this.handleLogout} resizeWindow={this.resizeWindow} />
        <div className={classnames(styles.app, drawerOpenClass)} {...activeIndicator}>
          <NavBar logout={this.handleLogout} user={user} openNav={this.openNav} isDrawerOpen={drawerOpen} />
          {this.props.children}
          <Loader />
        </div>
      </div>
    );
  }
}
