import React, { PropTypes } from 'react';

const { any, string } = PropTypes;

const CardHeader = ({ children, className }) => (<div className={className}>{children}</div>);

CardHeader.propTypes = {
  children: any,
  className: string
};

export default CardHeader;
