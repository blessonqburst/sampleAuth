import React, { PureComponent } from 'react';
// import Button from '../../components/button';
// import Input from '../../components/input';
import styles from './styles.scss';

export default class Login extends PureComponent {
  render() {
    return (
      <div className={styles.loginWrapper}>
        <form className={styles.loginForm}>
          ok Google
        </form>
      </div>
    );
  }
}