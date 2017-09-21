import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import styles from './Drawer.scss';

const { string, bool, func, oneOf, any } = PropTypes;

export default class Drawer extends PureComponent {
  static propTypes = {
    children: any.isRequired,
    className: string,
    from: oneOf(['left', 'right']),
    id: string,
    isOpen: bool,
    showClose: bool,
    toggleDrawer: func,
  }

  static defaultProps = {
    toggleDrawer: () => {},
    from: 'left',
    isOpen: false,
  };

  closeNav = () => this.props.toggleDrawer(this.props.id)

  render() {
    const { from, children, isOpen, className, showClose } = this.props;

    if (!isOpen) return null;

    return (
      <div className={classnames(styles.drawer, styles[from], className)}>
        { showClose ? <button className={classnames(styles.closeBtn, 'fa fa-times')} onClick={this.closeNav} /> : null }
        {children}
      </div>
    );
  }
}
