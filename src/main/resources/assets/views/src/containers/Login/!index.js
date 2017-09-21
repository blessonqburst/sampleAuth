import React, { PureComponent } from 'react';
import Button from '../../components/button';
import Input from '../../components/input';
import styles from './styles.scss';

export default class Login extends PureComponent {
  render() {
    return (
      <div className={styles.loginWrapper}>
        <form className={styles.loginForm}>
          <div className={styles.loginHead} >Login</div>
          <div className={styles.inputWrapper}>
            <Input className={styles.inputField} type="text" placeholder="EMAIL" />
            <Input className={styles.inputField} type="password" placeholder="PASSWORD" />
          </div>
          <div className={styles.buttonWrapper} >
            <Button type="login" label="loginq" />
          </div>
          <div className={styles.linkWrapper}>
            <a href="#">Forget Password</a>
            <a href="#">Create an account</a>
          </div>
        </form>
      </div>
    );
  }
}
