import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CardContent from '../CardContent';
import styles from '../CardContent.scss';

const defaultProps = {
  leftContent: '<div>Left Content</div>',
  rightContent: '<div>Right Content</div>',
};

describe('components/CardContent', () => {
  const setup = (props = defaultProps) => shallow(<CardContent {...props} />);

  it('should render CardContent component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render CardContent with proper divs', () => {
    const wrapper = setup();

    expect(wrapper.find('div').length).to.equal(3);
  });

  it('should render the CardContent with proper styles', () => {
    const wrapper = setup();

    expect(wrapper.find(`div.${styles.cardContent}`).length).to.equal(1);
  });

  it('should render the CardContent rightContent properly', () => {
    const wrapper = setup();

    expect(wrapper.find(`div.${styles.cardImage}`).length).to.equal(1);
  });

  it('should render the CardContent leftContent properly', () => {
    const wrapper = setup();

    expect(wrapper.find(`div.${styles.cardDetails}`).length).to.equal(1);
  });
});
