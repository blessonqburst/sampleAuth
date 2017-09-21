import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import logoImage from 'images/logo.png';
import MenuButton from '../MenuButton/MenuButton';
import styles from './NavBar.scss';

const { func, object, string, bool } = PropTypes;

export default class NavBar extends PureComponent {
  static propTypes = {
    className: string,
    isDrawerOpen: bool,
    isLogin: bool,
    logout: func,
    openNav: func,
  };

  static contextTypes = {
    user: object.isRequired,
    i18n: object,
  };

  state = {
    subMenuVisible: false,
  };

  toggleState = () => this.setState({ subMenuVisible: !this.state.subMenuVisible })

  render() {
    const { openNav, className, isDrawerOpen, logout, isLogin } = this.props;
    const { subMenuVisible } = this.state;
    const { user, i18n } = this.context;
    const drawerOpen = isDrawerOpen ? styles.drawerOpen : null;

    return (
      <div className={classnames(styles.navbar, className, drawerOpen)}>
        <div className={styles.appDefaults}>
          {isLogin ? null : <MenuButton leftIcon={<i className="fa fa-bars" aria-hidden="true" />} onClick={openNav} />}
          <img src={logoImage} alt={i18n.common.logo} className={styles.logoImage} />
        </div>
        {isLogin ?
          null :
          <div className={styles.userNav}>
            <div className={styles.userProvision} onMouseEnter={this.toggleState} onMouseLeave={this.toggleState}>
              <MenuButton
                leftIcon={<i className={classnames(styles.userIcon, 'fa fa-user-circle')} aria-hidden="true" />}
                label={user.name}
                rightIcon={<i className={classnames(styles.userArrow, 'fa fa-sort-desc')} aria-hidden="true" />}
                className={styles.user}
              />
              {
                subMenuVisible &&
                <div className={styles.secondLevelMenu}>
                  <MenuButton
                    leftIcon={<i className={classnames(styles.secondLevelIcon, 'fa fa-sign-out')} aria-hidden="true" />}
                    label="LOGOUT"
                    className={styles.secondLevelMenuItems}
                    onClick={logout}
                  />
                </div>
              }
            </div>
          </div>
        }
      </div>
    );
  }
}
