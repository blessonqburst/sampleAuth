/* const cols = [
    { key: 'macName', label: 'Machine Name' },
    { key: 'status', label: 'Status' },
    { key: 'opCode', label: 'Operator Code' },
    { key: 'jobs', label: '# of Jobs' },
    { key: 'start', label: 'Shift Start Time' },
    { key: 'end', label: 'Shift End Time' },
    { key: 'counter', label: 'Shift Counter' },
];

const data = [
    { id: 1, macName: 'Printer', status: 'ON', opCode: 174, jobs: 0, start: 1, end: 100, counter: 51 },
    { id: 2, macName: 'WindMill', status: 'OFF', opCode: 175, jobs: 1, start: 2, end: 200, counter: 52 },
    { id: 3, macName: 'PowerGrid', status: 'Inactive', opCode: 176, jobs: 2, start: 3, end: 300, counter: 53 },
]; */

import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import styles from './DataTable.scss';

const { arrayOf, object, any, bool, string, func } = PropTypes;
const noop = () => {};

export const DataRow = ({ children, header, ...other }) => {
  const Column = header ? 'th' : 'td';

  return (
    <tr {...other}>
      {
        React.Children.map(children, (child, index) => {
          const colSpan = child && child.props && child.props.colSpan || 1;

          return React.createElement(Column, { key: index, colSpan }, child);
        })
      }
    </tr>
  );
};

DataRow.propTypes = {
  children: any,
  header: bool,
};

export default class DataTable extends PureComponent {
  static propTypes = {
    children: any,
    className: string,
    columns: arrayOf(object),
    common: object,
    onClick: func,
    rows: arrayOf(object),
    skipHead: bool,
    stripped: bool,
  };

  static defaultProps = {
    onClick: noop,
  };

  generateClickHandler = item => event => this.props.onClick(event, item);

  renderHeaders() {
    const { columns, common } = this.props;
    let alteredColumns = columns;

    if (common && common.headers) {
      alteredColumns = [...columns, ...common.headers];
    }

    if (alteredColumns) {
      return alteredColumns.map((colData, index) => <th key={index}>{colData.label}</th>);
    }

    return <th />;
  }

  renderRows() {
    const { rows, children } = this.props;

    if (!rows) {
      return children;
    }

    return rows.map((item, index) => <tr key={index} onClick={this.generateClickHandler(item)}>{this.renderCells(item)}</tr>);
  }

  renderCells(rowData) {
    const { columns, stripped, common } = this.props;
    let alteredRowData = rowData;
    let alteredColumns = columns;

    if (common && common.headers) {
      alteredColumns = [...columns, ...common.headers];
      alteredRowData = { ...rowData, ...common.cells };
    }

    return alteredColumns.map((colData, index) => {
      const cellValue = alteredRowData[colData.key];

      return (
        <td
          key={index}
          data-label={colData.label}
          className={classnames({ [styles.stripped]: stripped })}
        >{typeof cellValue === 'function' ? cellValue(rowData) : cellValue}</td>
      );
    });
  }

  render() {
    const { className } = this.props;

    return (
      <table className={classnames(styles.responsiveTable, className)}>
        { this.props.skipHead ? null : <thead><tr>{this.renderHeaders()}</tr></thead> }
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }
}
