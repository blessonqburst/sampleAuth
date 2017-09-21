import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import { access, appRoutes } from 'config';
import adminIcon from 'images/admin.png';
import MenuButton from '../MenuButton/MenuButton';
import Drawer from '../Drawer/Drawer';
import Link from '../Link/Link';
import styles from './NavDrawer.scss';

const icons = {
  admin: adminIcon,
};

const { object, bool, func } = PropTypes;
const secondLevelMenu = classnames(styles.menuItems, styles.secondLevel);

const isActiveRoute = (route, location) => {
  const { pathname } = location;
  return pathname.endsWith(route) || pathname.indexOf(route) === (1 || 0);
};

export default class NavDrawer extends PureComponent {
  static propTypes = {
    location: object,
    logout: func,
    openDrawer: bool,
    resizeWindow: func,
  };

  static contextTypes = {
    user: object.isRequired,
    i18n: object,
  };

  componentWillMount() {
    window.onresize = this.props.resizeWindow;
    this.props.resizeWindow();
    const routes = Object.keys(appRoutes);

    routes.forEach((item, index) => {
      const link = appRoutes[item].link;
      const childIndex = `renderChild${index}`;

      if (isActiveRoute(link, location)) {
        this.setState({
          [childIndex]: true
        });
      } else {
        this.setState({
          [childIndex]: false
        });
      }
    });
  }

  handleCollapse = index => () => {
    const childIndex = `renderChild${index}`;

    this.setState({
      [childIndex]: !this.state[childIndex]
    });
  }

  renderNavChild(children, link, index) {
    const { location } = this.props;
    const { user } = this.context;
    const { restrictions = [] } = access[user.role];

    if (!isActiveRoute(link, location)) {
      return null;
    }

    return Object.keys(children).map((key, childIndex) => {
      const child = children[key];

      if (restrictions.indexOf(key) === -1 && child.isNav) {
        const childProps = {
          key: `${index}.${childIndex}`,
          label: child.label,
          to: `/${link}/${child.link}`,
          className: classnames(secondLevelMenu, { [styles.active]: isActiveRoute(`/${link}/${child.link}`, location) }),
          leftIcon: (
            <i
              className={
                classnames(styles.menuIcons, `fa ${child.icon}`, {
                  [styles.active]: isActiveRoute(`/${link}/${child.link}`, location)
                })
              }
              aria-hidden="true"
            />
          )
        };

        return <Link {...childProps} />;
      }

      return null;
    });
  }

  renderNavItems = () => {
    const { location } = this.props;
    const { user } = this.context;
    const { restrictions = [] } = access[user.role];
    const routes = Object.keys(appRoutes);

    return routes.map((menu, index) => {
      if (restrictions.indexOf(menu) === -1 && appRoutes[menu].isNav) {
        const { label, icon, link, children, iconProps, hasSubNav } = appRoutes[menu];
        const navIcon = icons[menu]
          ? <img src={icons[menu]} className={styles.menuIcons} alt={`${menu} icon`} {...iconProps} />
          : <i className={classnames(styles.menuIcons, `fa ${icon}`)} aria-hidden="true" />;
        const linkProps = {
          to: `/${link}`,
          key: index,
          leftIcon: <div>{navIcon}{label}</div>,
          className: classnames(styles.menuItems, { [styles.active]: isActiveRoute(link, location) }),
        };

        if (children) {
          if (hasSubNav) {
            const navActionIcon = isActiveRoute(link, location) ? 'fa-sort-asc' : 'fa-sort-desc';

            linkProps.children = <i className={classnames(styles.directional, `fa ${navActionIcon}`)} aria-hidden="true" />;
          }

          return (
            <div key={index}>
              <Link {...linkProps} />
              { this.renderNavChild(children, link, index) }
            </div>
          );
        }

        return <Link {...linkProps} />;
      }

      return null;
    });
  }

  render() {
    const { user } = this.context;
    const { openDrawer, logout } = this.props;

    return (
      <Drawer className={styles.navDrawer} from="left" isOpen={openDrawer}>
        <div className={styles.userInfo}>
          <div className={styles.userIcon}>
            <i className="fa fa-user-circle" aria-hidden="true" />
          </div>
          <div className={styles.userDetails}>
            <div className={styles.username}>
              {user.name}
              <i className={classnames(styles.userAct, 'fa fa-sort-desc')} aria-hidden="true" />
            </div>
            <div className={styles.userrole}>{user.account_type}</div>
            <MenuButton label="LOGOUT" className={styles.logout} onClick={logout} />
          </div>
        </div>
        {this.renderNavItems()}
      </Drawer>
    );
  }
}
