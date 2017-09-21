import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import styles from './DropDown.scss';

const { arrayOf, bool, func, number, oneOf, oneOfType, shape, string } = PropTypes;
const stringOrNumber = oneOfType([string, number]);

export const DropDownItem = props => <option {...props} />;

DropDownItem.propTypes = {
  disabled: bool,
  label: PropTypes.string,
  value: oneOfType([string, number]).isRequired,
};

const dropDownItemType = shape({ type: oneOf([DropDownItem]) });

export default class DropDown extends PureComponent {
  static propTypes = {
    appendDefault: bool,
    children: oneOfType([arrayOf(dropDownItemType), dropDownItemType]),
    className: string,
    ddClassName: string,
    defaultValue: oneOfType([stringOrNumber, arrayOf(stringOrNumber)]),
    disabled: bool,
    heading: string,
    headingStyle: string,
    mandatory: bool,
    multiSelect: bool,
    onChange: func,
    /**
     * [TODO]
     * Instead of children, DropDown can accept options defined as an Array of objects
     * [{ value: 'valueA', label: 'labelA' }, { value: 'valueB', label: 'labelB' }, ...]
     */
    options: arrayOf(shape({ value: stringOrNumber, label: stringOrNumber })),
    visibleCount: number,
  };

  static defaultProps = {
    onChange: () => {},
    defaultValue: '',
    mandatory: false,
    heading: '',
  }

  state = {
    value: this.props.defaultValue,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
    }
  }

  handleChange = (event) => {
    const { value } = event.target;

    this.setState({ value });
    this.props.onChange(event, value);
  }

  render() {
    const {
      className,
      children,
      multiSelect,
      visibleCount,
      headingStyle,
      mandatory,
      appendDefault,
      ddClassName,
      heading,
      defaultValue,
      ...otherProps,
    } = this.props;
    let defaultOption;

    if (appendDefault) {
      defaultOption = <option value="" label="Select" />;
    }

    return (
      <div className={classnames(styles.ddContainer, className)}>
        <label className={classnames(styles.heading, headingStyle)}>
          <span className={mandatory ? styles.required : styles.hidden}>*</span>
          {heading}
        </label>
        <select
          {...otherProps}
          className={classnames(styles.dropDown, ddClassName)}
          multiple={multiSelect}
          size={visibleCount}
          onChange={this.handleChange}
          value={this.state.value || defaultValue}
        >
          {defaultOption}
          {children}
        </select>
      </div>
    );
  }
}
