import React, { PureComponent } from 'react';
import { object } from 'prop-types';
import styles from './styles.scss';

export default class Master extends PureComponent {
  static propTypes = {
    children: object,
  }

  render() {
    return (
      <div className={styles.masterContainer}>
        <nav className={styles.navBar}>
          <img className={styles.logo} src="/images/seemymachines.png" />
        </nav>
        <div>{this.props.children}</div>
        <footer className={styles.footerContent} >Copyright (c) 2017 SeeMyMachines. All Rights Reserved</footer>
      </div>
    );
  }
}