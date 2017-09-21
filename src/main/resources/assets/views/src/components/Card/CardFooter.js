import React, { PropTypes } from 'react';
import styles from './CardFooter.scss';

const CardFooter = ({ children }) => (<div className={styles.cardMenu}>{children}</div>);

CardFooter.propTypes = {
  children: PropTypes.any,
};

export default CardFooter;
