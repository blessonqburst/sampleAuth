import React, { PropTypes } from 'react';
import classnames from 'classnames';
import style from './Tab.scss';

const { bool, string, func, number } = PropTypes;

const getClickHandler = (index, method) => () => method(index);

const TabItem = ({ isActive, label, className, onTabSelect, index }) => {
  const contentTabStyle = classnames(style.tabHeadItem, className, { [style.active]: isActive });

  return (
    <div className={contentTabStyle} onClick={getClickHandler(index, onTabSelect)}>
      {label}
    </div>
  );
};

TabItem.propTypes = {
  className: string,
  index: number,
  isActive: bool,
  label: string,
  onTabSelect: func,
};

export default TabItem;
