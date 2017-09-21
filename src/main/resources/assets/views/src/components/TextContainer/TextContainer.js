import React, { PropTypes } from 'react';

const TextContainer = ({ name, label, className, ...rest }) => (
  <div className={className}>
    <label htmlFor={name}>{label}</label>
    <input name={name} id={name} {...rest} />
  </div>
);

const { string, bool, func } = PropTypes;

TextContainer.propTypes = {
  className: string,
  label: string,
  name: string,
  onChange: func,
  required: bool,
  type: string,
};

export default TextContainer;
