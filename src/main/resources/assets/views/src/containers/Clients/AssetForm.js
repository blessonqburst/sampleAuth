import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import TextContainer from 'components/TextContainer/TextContainer';
import MenuButton from 'components/MenuButton/MenuButton';
import Link from 'components/Link/Link';
import { appRoutes } from 'config';
import * as actions from 'redux/modules/customers';
import DropDown, { DropDownItem } from 'components/DropDown/DropDown';
import styles from './Assets.scss';

const { object, func, array } = PropTypes;
const { asset, asset: { children: assetChild } } = appRoutes;
const initialState = {
  name: '',
  os: '',
};

@connect(({ customers }) => ({
  assetList: customers.assets,
  categories: customers.categories,
  deviceTypes: customers.deviceTypes,
}), {
  loadDeviceTypes: actions.loadDeviceTypes,
  loadCategories: actions.loadCategories,
  updateDevice: actions.updateDevice,
})
export default class HubForm extends Component {
  static propTypes = {
    assetList: array,
    categories: array,
    deviceTypes: array,
    loadCategories: func,
    loadDeviceTypes: func,
    params: object,
    updateDevice: func,
  }

  static contextTypes = {
    i18n: object,
  };

  state = {
    ...initialState,
  }

  componentDidMount = () => {
    const { params: { deviceId }, assetList, loadCategories, loadDeviceTypes, deviceTypes, categories } = this.props;

    if (deviceId) {
      let selectedDevice;

      assetList.forEach((assets) => {
        selectedDevice = assets.devices.find(aDevice => aDevice.id === deviceId) || selectedDevice;
      });

      if (!deviceTypes) {
        loadCategories();
      }

      if (!categories) {
        loadDeviceTypes();
      }

      this.setState({
        name: selectedDevice.name,
        categoryId: selectedDevice.category_id,
        deviceTypeId: selectedDevice.device_type_id,
        os: selectedDevice.os,
      });
    }
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }

  submitForm = (event) => {
    event.preventDefault();
    const { updateDevice, params: { deviceId } } = this.props;

    updateDevice({ ...this.state }, deviceId);
  }

  render() {
    const { name, os, categoryId, deviceTypeId } = this.state;
    const { deviceTypes, categories } = this.props;

    return (
      <div className={styles.updateContainer}>
        <div className={styles.pageHead}>Edit Device</div>
        <div className={styles.formContainer}>
          <form onSubmit={this.submitForm}>
            <TextContainer
              className={styles.textContainer}
              label="Name"
              onChange={this.handleChange('name')}
              value={name} required
            />
            <DropDown
              name="categoryId" heading="Category" onChange={this.handleChange('categoryId')}
              className={styles.selectContainer} required defaultValue={categoryId}
            >
              <DropDownItem label="Select Category" value="" />
              {categories && categories.map(category => (<DropDownItem label={category.category} value={category.id} key={category.id} />))}
            </DropDown>
            <DropDown
              name="deviceTypeId" heading="Device Type - Manufacturer" onChange={this.handleChange('deviceTypeId')}
              className={styles.selectContainer} required defaultValue={deviceTypeId}
            >
              <DropDownItem label="Select Type" value="" />
              {deviceTypes && deviceTypes.map(type => (<DropDownItem label={`${type.type} - ${type.manufacturer}`} value={type.id} key={type.id} />))}
            </DropDown>
            <TextContainer
              className={styles.textContainer}
              label="OS"
              onChange={this.handleChange('os')}
              value={os} required
            />
            <div className={styles.buttonContainer}>
              <MenuButton label="Update" className={styles.button} />
              <Link to={`/${asset.link}/${assetChild[1].link}`}><MenuButton label="Cancel" className={classnames(styles.button, styles.cancel)} /></Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
