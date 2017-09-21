import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './CardContainer.scss';

const { any, number, string } = PropTypes;

const CardContainer = ({ children, itemsPerRow, className }) => {
  let parentClassName = classnames(styles.item, styles.noTopMargin);

  parentClassName = (itemsPerRow === 2 ? classnames(parentClassName, styles.twoItems) : parentClassName);
  const wrappedChildren = React.Children.map(children, (currentChild, index) => (
    <div className={parentClassName} key={index}>{currentChild}</div>
  ));

  return (
    <div className={classnames(styles.cardContainer, className)} >
      {wrappedChildren}
    </div>
  );
};

CardContainer.propTypes = {
  children: any,
  className: string,
  itemsPerRow: number,
};

export default CardContainer;
