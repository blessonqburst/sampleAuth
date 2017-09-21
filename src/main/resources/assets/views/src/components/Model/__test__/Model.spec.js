import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Modal from '../Model.js';
import styles from '../Model.scss';

const defaultProps = {
  heading: 'My',
  children: 'Name',
  footer: 'is',
  close: () => {},
};

describe('components/Modal', () => {
  const setup = (props = defaultProps) => shallow(<Modal {...props} />);

  it('should render Drawer component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render the Modal', () => {
    const wrapper = setup();

    expect(wrapper.find(`div.${styles.root}`).length).to.equal(1);
    expect(wrapper.find(`div.${styles.modalContainer}`).length).to.equal(1);
    expect(wrapper.find(`div.${styles.modalHeader}`).length).to.equal(1);
    expect(wrapper.find(`div.${styles.modalBody}`).length).to.equal(1);
    expect(wrapper.find(`div.${styles.modalFooter}`).length).to.equal(1);
  });

  it('should render the Modal close button', () => {
    const wrapper = setup();

    expect(wrapper.find('button').length).to.equal(1);
  });

  it('should trigger onClick callback prop', () => {
    const onButtonClick = sinon.spy();
    const wrapper = setup({ ...defaultProps, close: onButtonClick });
    const button = wrapper.find('button');

    expect(button.length).to.equal(1);
    button.simulate('click');
    expect(onButtonClick.called).to.equal(true);
  });
});
