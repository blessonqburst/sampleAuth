import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DataTable from '../DataTable';

const defaultProps = {
  rows: [{ id: 1, macName: 'Printer', status: 'ON', opCode: 174, jobs: 0, start: 1, end: 100, counter: 51 }],
  columns: [{ key: 'macName', label: 'Machine Name' }],
};

describe('components/DataTable', () => {
  const setup = (props = defaultProps) => shallow(<DataTable {...props} />);

  it('should render DataTable component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render the table with rows and columns', () => {
    const wrapper = setup();

    expect(wrapper.find('table').length).to.equal(1);
  });

  it('should render the table with column header from props', () => {
    const wrapper = setup();

    expect(wrapper.find('th').length).to.equal(1);
  });

  it('should render the table with rows of data from props', () => {
    const wrapper = setup();

    expect(wrapper.find('td').length).to.equal(1);
  });
});
