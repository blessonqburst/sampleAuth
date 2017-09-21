import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import styles from './styles.scss';

export default class Button extends PureComponent {
  static propTypes = {
    label: string,
    type: string,
    className: string,
  }

  render() {
    const { type, label, className, ...others } = this.props;
    const styleClass = type === "login" ? `${styles.login} ${className}` : className;

    return (
      <button className={styleClass} {...others} >{label}</button>
    );
  }
}