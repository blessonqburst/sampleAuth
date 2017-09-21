import React, { PropTypes } from 'react';
import classnames from 'classnames';

import styles from './Card.scss';

const { any, number, bool, oneOf, func, string } = PropTypes;

const Card = ({ children, contentAlign, centerContentVertically, onClick, className }) => {
  const classArgs = classnames(styles.Card, styles[contentAlign], {
    [styles.verticallyCenter]: centerContentVertically,
  }, className);

  return <div className={classArgs} onClick={onClick}>{children}</div>;
};

Card.propTypes = {
  centerContentVertically: bool,
  children: any,
  className: string,
  colSpan: number, // eslint-disable-line react/no-unused-prop-types, TODO @yadhu verify this
  contentAlign: oneOf(['center', 'left', 'right']),
  onClick: func,
};

Card.defaultProps = {
  contentAlign: 'center',
  centerContentVertically: false,
};

export default Card;
