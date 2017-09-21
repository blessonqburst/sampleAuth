import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { appRoutes } from 'config';
import Helmet from 'react-helmet';
import Device from 'components/Device/Device';
import Card, { CardHeader } from 'components/Card';
import Link from 'components/Link/Link';
import { loadSummary } from 'redux/modules/customers';
// import assetList from '../../redux/modules/mockData/summary';
import styles from './Assets.scss';

const { object, arrayOf, func } = PropTypes;
const { asset: assetUrl } = appRoutes;

const cols = [
  { key: 'type', label: 'Device Type' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'no_of_devices', label: 'No. of Devices' },
];

@connect(state => ({
  assetList: state.customers.summary,
}), {
  loadSummary,
})
export default class Summary extends Component {
  static propTypes = {
    assetList: arrayOf(object),
    loadSummary: func,
  }

  static contextTypes = {
    i18n: object,
  };

  componentDidMount() {
    this.props.loadSummary();
  }

  createRow = (data) => {
    const assetArray = [];

    data.forEach((user) => {
      user.devices.forEach((device) => {
        device.edit = (
          <Link to={`${assetUrl.link}/${device.id}`} className={styles.link}>
            <i className="fa fa-edit" />
          </Link>
        );
      });

      assetArray.push(user);
    });

    return assetArray;
  }

  render() {
    const { assetList } = this.props;
    const assetData = this.createRow(assetList);

    return (
      <div className={styles.assetContainer}>
        <Helmet title="Summary" />
        <div className={styles.pageHead}>{assetUrl.label}</div>
        {
          assetData.map((asset, index) => (
            <Card key={index}>
              <CardHeader className={styles.cardHeader}>
                <div>Zip Code: {asset.zip_code}</div>
              </CardHeader>
              <Device rows={asset.devices} cols={cols} type="summary" />
            </Card>
          ))
        }
      </div>);
  }
}
