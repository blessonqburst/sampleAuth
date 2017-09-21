import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Tab from '../Tab';
import TabItem from '../TabItem';

const defaultProps = {
  children: <TabItem />,
  fullWidth: false,
};

describe('Tab component', () => {
  const setup = () => mount(<Tab {...defaultProps} />);

  it('should render Tab component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render Children', () => {
    const wrapper = setup();
    const children = wrapper.find('TabItem');

    expect(children.length).to.equal(1);
  });

  it('should have prop fullWidth', () => {
    const wrapper = setup();
    const fullWidth = wrapper.find('TabItem').props().fullWidth;

    expect(fullWidth).to.equal(false);
  });

  it('should have Active TabItem', () => {
    const wrapper = setup();
    const isActive = wrapper.find('TabItem').props().isActive;

    expect(isActive).to.equal(true);
  });
});
