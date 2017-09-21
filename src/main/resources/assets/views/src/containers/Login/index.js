import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import cookie from 'react-cookies';

import { logout } from 'redux/modules/auth';
import Helmet from 'react-helmet';
import { updateLoader } from 'redux/modules/loader';
import NavBar from 'components/NavBar/NavBar';
import { MenuButton } from 'components';

import styles from './Login.scss';

const { func, object } = PropTypes;

@connect(
  state => ({ user: state.auth.user }), { updateLoader, logout }
)

export default class Login extends Component {

  static propTypes = {
    login: func,
    logout: func,
    updateLoader: func,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    email: '',
    password: '',
    error: null,
  };

  componentDidMount = () => {
    this.email.focus();
    this.props.updateLoader(false);
    this.props.logout();
  }

  getRef = (input) => { this.email = input; }
  trackChange = name => event => this.setState({ [name]: event.target.value });

  render() {
    const { password, email, signup, login } = this.context.i18n;
    const { query } = this.props;

    const error = query.errorMsg ? query.errorMsg : null;

    const oidc = cookie.load('oidc.sid') || '';

    return (
      <div className={styles.loginWrapper}>
        <Helmet title="Login" />
        <NavBar isLogin />
        <form className={styles.loginForm} name="form" role="form" action="/api/auth/login" method="post">
          <div className={styles.loginHead}>Login</div>
          <div className={styles.formContainer}>
            { error ? <label className={styles.errorMsg}>{error.message || error.data || error}</label> : null }
            <div className={classnames(styles.textInput, styles.loginInput)}>
              <label htmlFor="username">{email}</label>
              <i className={classnames(styles.formControlIcon, 'fa fa-user')} aria-hidden="true" />
              <input
                type="email"
                name="login_id"
                label={email}
                onChange={this.trackChange('email')}
                ref={this.getRef}
                required
              />
            </div>
            <div className={classnames(styles.textInput, styles.loginInput)}>
              <label htmlFor="password">{password}</label>
              <i className={classnames(styles.formControlIcon, 'fa fa-key')} aria-hidden="true" />
              <input
                name="password"
                label={password}
                type="password"
                onChange={this.trackChange('password')}
                required
              />
            </div>
            <input
              name="oidc"
              type="hidden"
              value={oidc}
            />
            <div className={styles.buttonContainer}>
              <MenuButton label={login} type="submit" className={styles.loginBtn} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
