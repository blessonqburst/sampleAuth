import React, { PureComponent, PropTypes, Children, cloneElement } from 'react';
import classnames from 'classnames';
import styles from './Tab.scss';

const { any, bool, string, number, func } = PropTypes;

export default class Tab extends PureComponent {

  static propTypes = {
    activeTab: number,
    children: any,
    className: string,
    contentClass: string,
    fullWidth: bool,
    headName: string,
    tabChange: func,
  };

  state = {
    activeTabIndex: 0,
  }

  componentWillMount() {
    const { activeTab } = this.props;

    if (activeTab > -1 && activeTab !== this.state.activeTabIndex) {
      this.setState({ activeTabIndex: activeTab });
    }
  }

  onTabSelect = (index) => {
    this.setState({ activeTabIndex: index });
    this.props.tabChange(index);
  }

  renderChildren() {
    const { props: { children, fullWidth }, state: { activeTabIndex } } = this;
    let content = null;
    const tabHead = Children.map(children, (child, index) => {
      if (activeTabIndex === index) {
        content = child.props.children;
      }

      return cloneElement(child, {
        index,
        fullWidth,
        isActive: activeTabIndex === index,
        onTabSelect: this.onTabSelect
      });
    });

    return { tabHead, content };
  }

  render() {
    const { className, contentClass, headName } = this.props;
    const { tabHead, content } = this.renderChildren();

    return (
      <div className={classnames(styles.tabs, className)}>
        <div className={classnames(styles.tabHead, headName)}>
          {tabHead}
        </div>
        <div className={classnames(styles.tabContent, contentClass)}>{content}</div>
      </div>
    );
  }
}
