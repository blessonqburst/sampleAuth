import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import styles from './Model.scss';

const { string, any, func, bool } = PropTypes;

export default class Modal extends PureComponent {
  static propTypes = {
    children: any,
    close: func,
    footer: any,
    heading: string,
    show: bool,
    showHeader: bool,
  };

  static defaultProps = {
    showHeader: true,
  };

  cancelDialog = () => this.props.close(false);

  handleClick = (event) => {
    event.stopPropagation();

    return false;
  };

  render() {
    const { heading, children, footer, showHeader, show } = this.props;
    const closeButton = <button className={classnames('fa fa-times-circle', styles.closeBtn)} onClick={this.cancelDialog} />;

    if (!show) return null;

    return (
      <div className={styles.root} onClick={this.cancelDialog}>
        <div className={styles.modalContainer} onClick={this.handleClick}>
          {
            showHeader &&
            <div className={styles.modalHeader}>
              {heading}{closeButton}
            </div>
          }
          <div className={styles.modalBody}>
            {children} {!showHeader && closeButton}
          </div>
          {
            footer &&
            <div className={styles.modalFooter}>
              {footer}
            </div>
          }
        </div>
      </div>
    );
  }
}
