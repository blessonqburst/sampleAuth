import React from 'react';
import { Link } from 'components';
import { mount } from 'enzyme';
import { expect } from 'chai';
import TabItem from '../TabItem';

const defaultProps = {
  isActive: true,
  label: 'TabItem label',
  index: 0,
  link: '/TabItem_link',
  fullWidth: false,
  children: <div>TabItem 1</div>,
};
const defaultPropsFull = {
  fullWidth: true,
};
const renderProps = {
  isActive: false,
  link: '',
};
const renderPropsActive = {
  link: '',
};
const renderPropsActiveFull = {
  link: '',
  fullWidth: true,
};

describe('TabItem component', () => {
  const setup = (props = {}) => mount(<TabItem {...defaultProps} {...props} />);

  it('should render TabItem component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render Link', () => {
    const wrapper = setup();
    const children = wrapper.find(Link);

    expect(children.length).to.equal(1);
  });

  it('should have link to', () => {
    const wrapper = setup();
    const children = wrapper.find(Link);

    expect(children.first().props().to).to.equal('/TabItem_link');
  });

  it('should not render Link', () => {
    const wrapper = setup(renderPropsActive);
    const noChildren = wrapper.find(Link);

    expect(noChildren.length).to.equal(0);
  });

  it('should render children when Tab is Active', () => {
    const wrapper = setup(renderPropsActive);
    const children = wrapper.find('div').at(3);

    expect(children.props().children).to.equal('TabItem 1');
  });

  it('should render label when Tab is Active', () => {
    const wrapper = setup(renderPropsActive);
    const children = wrapper.find('div').at(1);

    expect(children.props().children).to.equal('TabItem label');
  });

  it('should not render children when Tab is not Active', () => {
    const wrapper = setup(renderProps);
    const children = wrapper.find('div').at(3);

    expect(children.length).to.equal(0);
  });

  it('should not render label when Tab is not Active', () => {
    const wrapper = setup(renderProps);
    const children = wrapper.find('div').at(1);

    expect(children.props().children).to.equal('TabItem label');
  });

  it('should have classname when fullWidth', () => {
    const wrapper = setup(renderPropsActiveFull);
    const children = wrapper.find('div').at(0);

    expect(children.props().className).to.equal('item___VjdH6');
  });

  it('should not have classname when not fullWidth', () => {
    const wrapper = setup(renderPropsActive);
    const children = wrapper.find('div').at(0);

    expect(children.props().className).to.equal('');
  });

  it('should have classname for Link when fullWidth', () => {
    const wrapper = setup(defaultPropsFull);
    const children = wrapper.find('div');

    expect(children.first().props().className).to.equal('tabs___1QqsR full___-8Fkd');
  });

  it('should not have classname for Link when not fullWidth', () => {
    const wrapper = setup();
    const children = wrapper.find('div');

    expect(children.first().props().className).to.equal('tabs___1QqsR');
  });
});
