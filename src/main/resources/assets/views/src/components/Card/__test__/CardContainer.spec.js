import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CardContainer from '../CardContainer';
import styles from '../CardContainer.scss';

describe('components/CardContainer', () => {
  const setup = props => shallow(<CardContainer {...props} />);

  it('should render CardContainer component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render CardContainer inside a wrapper div', () => {
    const wrapper = setup();

    expect(wrapper.find('div').length).to.equal(1);
  });

  it('should render the CardContainer with proper styles', () => {
    const wrapper = setup();

    expect(wrapper.find(`div.${styles.cardContainer}`).length).to.equal(1);
  });
});
