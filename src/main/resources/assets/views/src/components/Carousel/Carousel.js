import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import styles from './Carousel.scss';

const { array, number, string } = PropTypes;
let dataLength = 0;

export default class Carousel extends PureComponent {
  static propTypes = {
    altText: string,
    currentIndex: number,
    data: array,
  }

  componentWillMount() {
    const { currentIndex, data } = this.props;

    dataLength = data.length;
    const showPrev = currentIndex > 0 && dataLength > 1;
    const showNext = dataLength > currentIndex + 1;

    this.setState({
      tabIndex: currentIndex,
      showPrev,
      showNext,
    });
  }

  mapData = () => {
    const { data, altText } = this.props;
    const { tabIndex } = this.state;

    return data.map((item, index) => {
      let url;
      let alternateText;

      if (typeof item === 'object') {
        url = item.source;
        alternateText = item.altText;
      } else {
        url = item;
        alternateText = altText;
      }

      return (
        <img
          src={url}
          alt={alternateText}
          className={classnames(styles.image,
            { [styles.active]: tabIndex === index },
            { [styles.outside]: tabIndex !== index }
            )}
        />);
    });
  }

  switchImage = type => () => {
    const { tabIndex } = this.state;
    const currentIndex = (type === 'next' ? (tabIndex + 1) : (tabIndex - 1));
    const showPrev = currentIndex > 0 && dataLength > 1;
    const showNext = dataLength > currentIndex + 1;

    this.setState({
      tabIndex: currentIndex,
      showPrev,
      showNext,
    });
  };

  render() {
    const { showNext, showPrev } = this.state;

    return (
      <div className={styles.carousel}>
        {showPrev ? <i className={classnames('fa fa-chevron-left', styles.left)} aria-hidden="true" onClick={this.switchImage('prev')} /> : null}
        { this.mapData() }
        {showNext ? <i className={classnames('fa fa-chevron-right', styles.right)} aria-hidden="true" onClick={this.switchImage('next')} /> : null}
      </div>
    );
  }
}
