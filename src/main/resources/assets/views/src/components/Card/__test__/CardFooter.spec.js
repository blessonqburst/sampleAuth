import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CardFooter from '../CardFooter';
import styles from '../CardFooter.scss';

const defaultProps = {
  children: '<div>Test</div>',
};

describe('components/CardFooter', () => {
  const setup = (props = defaultProps) => shallow(<CardFooter {...props} />);

  it('should render CardFooter component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render CardFooter inside a wrapper div', () => {
    const wrapper = setup();

    expect(wrapper.find('div').length).to.equal(1);
  });

  it('should render the CardFooter with proper styles', () => {
    const wrapper = setup();

    expect(wrapper.find(`div.${styles.cardMenu}`).length).to.equal(1);
  });

  it('should render the Card CardFooter properly', () => {
    const wrapper = setup();

    expect(wrapper.props().children).to.equal('<div>Test</div>');
  });
});
