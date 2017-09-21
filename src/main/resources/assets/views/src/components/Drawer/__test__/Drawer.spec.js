import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Drawer from '../Drawer.js';
import styles from '../Drawer.scss';

const defaultProps = {
  isOpen: true,
  children: 'asdasd',
  from: 'left',
  id: 'Drawer1',
  toggleDrawer: () => {},
};

describe('components/Drawer', () => {
  const setup = (props = defaultProps) => shallow(<Drawer {...props} />);

  it('should render Drawer component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render the Drawer', () => {
    const wrapper = setup();

    expect(wrapper.find(`div.${styles.drawer}`).length).to.equal(1);
    expect(wrapper.find(`div.${styles.left}`).length).to.equal(1);
  });

  it('should render the Drawer close button', () => {
    const wrapper = setup();

    expect(wrapper.find('button').length).to.equal(1);
  });

  it('should trigger onClick callback prop', () => {
    const onButtonClick = sinon.spy();
    const wrapper = setup({ ...defaultProps, toggleDrawer: onButtonClick });
    const button = wrapper.find('button');

    expect(button.length).to.equal(1);

    button.simulate('click');
    expect(onButtonClick.called).to.equal(true);
  });
});

