import React from 'react';
import classnames from 'classnames';
import styles from './NotFound.scss';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404!</h1>
      <i className={classnames(styles.notFound, 'fa fa-frown-o')} aria-hidden="true" />
      <p>The page you are looking for no longer exist!</p>
    </div>
  );
}
