import React from 'react';
import sinon from 'sinon';
import { shallowWithContext, mountWithContext } from 'utils/testHelpers';
import { expect } from 'chai';

import logoImage from 'images/logo.png';
import { MenuButton } from 'components';
import { appRoutes } from 'config';
import NavBar from '../NavBar';
import styles from '../NavBar.scss';

const { dashboard, tickets, jobs, shifts, manage } = appRoutes;

const defaultProps = {
  logout: sinon.spy(),
};

const getContext = userType => ({
  user: {
    token: 'something to call as token',
    account_type: userType || 'Super-User',
  },
});

describe('component/NavBar', () => {
  const getShallow = (props = {}, context = {}) => shallowWithContext(<NavBar {...props} />, context);
  const getMount = (props = {}, context = {}) => mountWithContext(<NavBar {...props} />, context);

  it('should not render any menu items when user is not available via context', () => {
    const wrapper = getShallow();

    expect(wrapper.containsMatchingElement(MenuButton)).to.equal(false);
  });

  it('should render the logo when user is not logged in', () => {
    const wrapper = getShallow();

    expect(wrapper.contains(<img src={logoImage} alt="logo" />)).to.equal(true);
  });

  it('should have disabled class when user is not logged in', () => {
    const wrapper = getShallow();

    expect(wrapper.find(`.${styles.disabledNavbar}`).length).to.equal(1);
  });

  it('should not have disabled class when user is not logged in', () => {
    const wrapper = getShallow();

    expect(wrapper.find(`.${styles.navbar}`).length).to.equal(0);
  });

  describe('Super-User', () => {
    afterEach(() => {
      defaultProps.logout.reset();
    });

    it('should render all menu items for super user', () => {
      const wrapper = getShallow(defaultProps, getContext('Super-User'));

      expect(wrapper.find(MenuButton).length).to.equal(6);
    });

    it('should render dashboard menu with cogs(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Super-User'));

      expect(wrapper.html()).to.contain(dashboard.label);
      expect(wrapper.contains(<i className="fa fa-cogs" aria-hidden="true" />)).to.equal(true);
    });

    it('should render tickets menu with ticket(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Super-User'));

      expect(wrapper.html()).to.contain(tickets.label);
      expect(wrapper.contains(<i className="fa fa-ticket" aria-hidden="true" />)).to.equal(true);
    });

    it('should render jobs.key menu with briefcase(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Super-User'));

      expect(wrapper.html()).to.contain(jobs.label);
      expect(wrapper.contains(<i className="fa fa-briefcase" aria-hidden="true" />)).to.equal(true);
    });

    it('should render shifts menu with retweet(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Super-User'));

      expect(wrapper.html()).to.contain(shifts.label);
      expect(wrapper.contains(<i className="fa fa-retweet" aria-hidden="true" />)).to.equal(true);
    });

    it('should render manage menu with user(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Super-User'));

      expect(wrapper.html()).to.contain(manage.label);
      expect(wrapper.contains(<i className="fa fa-user" aria-hidden="true" />)).to.equal(true);
    });

    it('should invoke the logout method on click', () => {
      const wrapper = getMount(defaultProps, getContext('Super-User'));

      wrapper.find('button').simulate('click');
      expect(defaultProps.logout.called).to.equal(true);
    });

    it('should not display any menu items when the user logs out', () => {
      const wrapper = getMount(defaultProps, getContext('Super-User'));

      expect(wrapper.find(MenuButton).length).to.equal(6);
      wrapper.setContext({ user: {} });
      expect(wrapper.find(MenuButton).length).to.equal(0);
    });
  });

  describe('Management / Service / Production', () => {
    afterEach(() => {
      defaultProps.logout.reset();
    });

    it('should render tickets, machines & logout menu items for Management / Service / Production user', () => {
      const wrapper = getShallow(defaultProps, getContext('Management'));

      expect(wrapper.find(MenuButton).length).to.equal(3);
    });

    it('should render machines menu with cogs(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Service'));

      expect(wrapper.html()).to.contain(dashboard.label);
      expect(wrapper.contains(<i className="fa fa-cogs" aria-hidden="true" />)).to.equal(true);
    });

    it('should render tickets menu with ticket(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Management'));

      expect(wrapper.html()).to.contain(tickets.label);
      expect(wrapper.contains(<i className="fa fa-ticket" aria-hidden="true" />)).to.equal(true);
    });

    it('should not render jobs menu with briefcase(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Service'));

      expect(wrapper.html()).to.not.contain(jobs.label);
      expect(wrapper.contains(<i className="fa fa-briefcase" aria-hidden="true" />)).to.equal(false);
    });

    it('should not render shifts menu with retweet(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Management'));

      expect(wrapper.html()).to.not.contain(shifts.label);
      expect(wrapper.contains(<i className="fa fa-retweet" aria-hidden="true" />)).to.equal(false);
    });

    it('should not render manage menu with user(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Management'));

      expect(wrapper.html()).to.not.contain(manage.label);
      expect(wrapper.contains(<i className="fa fa-user" aria-hidden="true" />)).to.equal(false);
    });

    it('should invoke the logout method on click', () => {
      const wrapper = getMount(defaultProps, getContext('Production'));

      wrapper.find('button').simulate('click');
      expect(defaultProps.logout.called).to.equal(true);
    });

    it('should not display any menu items when the user logs out', () => {
      const wrapper = getMount(defaultProps, getContext('Production'));

      expect(wrapper.find(MenuButton).length).to.equal(3);
      wrapper.setContext({ user: {} });
      expect(wrapper.find(MenuButton).length).to.equal(0);
    });
  });

  describe('Admin', () => {
    afterEach(() => {
      defaultProps.logout.reset();
    });

    it('should render manage & logout menu items for Adminr', () => {
      const wrapper = getShallow(defaultProps, getContext('Admin'));

      expect(wrapper.find(MenuButton).length).to.equal(2);
    });

    it('should not render machines menu with cogs(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Admin'));

      expect(wrapper.html()).to.not.contain(dashboard.label);
      expect(wrapper.contains(<i className="fa fa-cogs" aria-hidden="true" />)).to.equal(false);
    });

    it('should not render tickets menu with ticket(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Admin'));

      expect(wrapper.html()).to.not.contain(tickets.label);
      expect(wrapper.contains(<i className="fa fa-ticket" aria-hidden="true" />)).to.equal(false);
    });

    it('should not render jobs menu with briefcase(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Admin'));

      expect(wrapper.html()).to.not.contain(jobs.label);
      expect(wrapper.contains(<i className="fa fa-briefcase" aria-hidden="true" />)).to.equal(false);
    });

    it('should not render shifts menu with retweet(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Admin'));

      expect(wrapper.html()).to.not.contain(shifts.label);
      expect(wrapper.contains(<i className="fa fa-retweet" aria-hidden="true" />)).to.equal(false);
    });

    it('should render manage menu with user(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Admin'));

      expect(wrapper.html()).to.contain(manage.label);
      expect(wrapper.contains(<i className="fa fa-user" aria-hidden="true" />)).to.equal(true);
    });

    it('should invoke the logout method on click', () => {
      const wrapper = getMount(defaultProps, getContext('Admin'));

      wrapper.find('button').simulate('click');
      expect(defaultProps.logout.called).to.equal(true);
    });

    it('should not display any menu items when the user logs out', () => {
      const wrapper = getMount(defaultProps, getContext('Admin'));

      expect(wrapper.find(MenuButton).length).to.equal(2);
      wrapper.setContext({ user: {} });
      expect(wrapper.find(MenuButton).length).to.equal(0);
    });
  });

  describe('Data Entry', () => {
    afterEach(() => {
      defaultProps.logout.reset();
    });

    it('should not render jobs, shifts & logout menu items for Data Entry user', () => {
      const wrapper = getShallow(defaultProps, getContext('Data Entry'));

      expect(wrapper.find(MenuButton).length).to.equal(3);
    });

    it('should not render machines menu with cogs(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Data Entry'));

      expect(wrapper.html()).to.not.contain(dashboard.label);
      expect(wrapper.contains(<i className="fa fa-cogs" aria-hidden="true" />)).to.equal(false);
    });

    it('should not render tickets menu with ticket(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Data Entry'));

      expect(wrapper.html()).to.not.contain(tickets.label);
      expect(wrapper.contains(<i className="fa fa-ticket" aria-hidden="true" />)).to.equal(false);
    });

    it('should render jobs menu with briefcase(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Data Entry'));

      expect(wrapper.html()).to.contain(jobs.label);
      expect(wrapper.contains(<i className="fa fa-briefcase" aria-hidden="true" />)).to.equal(true);
    });

    it('should render shifts menu with retweet(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Data Entry'));

      expect(wrapper.html()).to.contain(shifts.label);
      expect(wrapper.contains(<i className="fa fa-retweet" aria-hidden="true" />)).to.equal(true);
    });

    it('should render manage menu with user(fontawesome) icon', () => {
      const wrapper = getMount(defaultProps, getContext('Data Entry'));

      expect(wrapper.html()).to.not.contain(manage.label);
      expect(wrapper.contains(<i className="fa fa-user" aria-hidden="true" />)).to.equal(false);
    });

    it('should invoke the logout method on click', () => {
      const wrapper = getMount(defaultProps, getContext('Data Entry'));

      wrapper.find('button').simulate('click');
      expect(defaultProps.logout.called).to.equal(true);
    });

    it('should not display any menu items when the user logs out', () => {
      const wrapper = getMount(defaultProps, getContext('Data Entry'));

      expect(wrapper.find(MenuButton).length).to.equal(3);
      wrapper.setContext({ user: {} });
      expect(wrapper.find(MenuButton).length).to.equal(0);
    });
  });
});
