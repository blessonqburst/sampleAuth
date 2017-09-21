import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Card from '../Card';
import styles from '../Card.scss';

const defaultProps = {
  children: '<div>Test</div>',
};

describe('components/Card', () => {
  const setup = (props = defaultProps) => shallow(<Card {...props} />);

  it('should render Card component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render Card inside a wrapper div', () => {
    const wrapper = setup();

    expect(wrapper.find('div').length).to.equal(1);
  });

  it('should render the Card with proper styles', () => {
    const wrapper = setup();

    expect(wrapper.find(`div.${styles.Card}`).length).to.equal(1);
  });

  it('should render the Card children properly', () => {
    const wrapper = setup();

    expect(wrapper.props().children).to.equal('<div>Test</div>');
  });
});
