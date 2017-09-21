import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import TextContainer from 'components/TextContainer/TextContainer';
import MenuButton from 'components/MenuButton/MenuButton';
import Link from 'components/Link/Link';
import { appRoutes } from 'config';
import styles from './Assets.scss';
import assetList from '../../redux/modules/mockData/assets';

const { object } = PropTypes;
const { asset: assetUrl } = appRoutes;

@connect(state => ({
  assetList: state.asset
}), {

})
export default class Update extends Component {
  static propTypes = {
    params: object,
  }

  static contextTypes = {
    i18n: object,
  };

  componentWillMount() {
    const { assetId } = this.props.params;
    let assetObj = {};

    assetList.forEach((user) => {
      user.devices.forEach((device) => {
        if (device.id === assetId) {
          assetObj = device;
        }

        return assetObj;
      });
    });

    this.setState({
      ...assetObj
    });
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value
    });
  }

  render() {
    const { name, category, manufacturer, model, ip_address: ipAddress, mac_address: macAddress, host_address: hostAddress, os } = this.state;

    return (
      <div className={styles.updateContainer}>
        <div className={styles.pageHead}>Edit Device</div>
        <div className={styles.formContainer}>
          <form>
            <TextContainer className={styles.textContainer} label="Name" onChange={this.handleChange('name')} value={name} required />
            <TextContainer className={styles.textContainer} label="Category" onChange={this.handleChange('category')} value={category} required />
            <TextContainer className={styles.textContainer} label="Manufacturer" onChange={this.handleChange('manufacturer')} value={manufacturer} required />
            <TextContainer className={styles.textContainer} label="Model" onChange={this.handleChange('model')} value={model} required />
            <TextContainer className={styles.textContainer} label="Ip Address" onChange={this.handleChange('ip_address')} value={ipAddress} required />
            <TextContainer className={styles.textContainer} label="Mac Address" onChange={this.handleChange('mac_address')} value={macAddress} required />
            <TextContainer className={styles.textContainer} label="Host Address" onChange={this.handleChange('host_address')} value={hostAddress} required />
            <TextContainer className={styles.textContainer} label="OS" onChange={this.handleChange('os')} value={os} />
            <div className={styles.buttonContainer}>
              <MenuButton label="Submit" className={styles.button} />
              <Link to={`/${assetUrl.link}`}><MenuButton label="Cancel" className={classnames(styles.button, styles.cancel)} /></Link>
              <MenuButton label="Delete" className={classnames(styles.button, styles.delete)} />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
