import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './CardContent.scss';

const { any, string } = PropTypes;

const CardContent = ({ leftContent, rightContent, className }) => (
  <div className={classnames(styles.cardContent, className)}>
    <div className={styles.leftContent}>{leftContent}</div>
    <div className={styles.rightContent}>{rightContent}</div>
  </div>
);

CardContent.propTypes = {
  children: any, // eslint-disable-line react/no-unused-prop-types, TODO @abhijith: do you need this?
  className: string,
  leftContent: any,
  rightContent: any,
};

export default CardContent;
