import React, { PropTypes, Component } from 'react';
import DataTable from 'components/DataTable/DataTable';
import { appRoutes } from 'config';
import Card, { CardContainer, CardHeader } from 'components/Card';
import Link from 'components/Link/Link';
import styles from './Device.scss';

const { object, arrayOf, string } = PropTypes;
const { clients: clientUrl,  users: userUrl } = appRoutes;

export default class User extends Component {
  static propTypes = {
    cols: arrayOf(object),
    common: object,
    rows: arrayOf(object),
    type: string,
  }

  static contextTypes = {
    i18n: object,
  };

  createCardView = (data, type, cols, common) => {
    if (type === 'client') {
      return (
        <CardContainer className={styles.cardRow}>
          {
            data.map((item, index) => {
              return (
                <Card key={index} className={styles.deviceCard}>
                  <div><label>Name: </label>{item.client_name}</div>
                  <div><label>Permission URI: </label>{item.permission_uri}</div>
                  <div><label>Redirect URI: </label>{item.redirect_uri}</div>
                  <div><label>Users Count: </label>{item.user_count}</div>
                  <div><label>Created By: </label>{item.created_by}</div>
                  <div><label>Created On: </label>{item.createdDt}</div>
                  <div><label>View Secret: </label>{item.viewSecret}</div>
                  <div><label>View Users: </label>{item.viewUser}</div>
                  <div><label>Generate Token: </label>{item.generateToken}</div>
                  <div><label>Edit Client: </label>{item.edit}</div>

                </Card>
              );
            })
          }
        </CardContainer>);
      }

      if (type === 'clientUsers') {
        return (
          <CardContainer className={styles.cardRow}>
            {
              data.map((item, index) => {
                return (
                  <Card key={index} className={styles.deviceCard}>
                    <div><label>Name: </label>{item.name}</div>
                    <div><label>Email: </label>{item.email}</div>
                    <div><label>Contact: </label>{item.contact}</div>
                    <div><label>Role: </label>{item.role}</div>
                    <div><label>Edit: </label>{item.edit}</div>
                  </Card>
                );
              })
            }
          </CardContainer>
        );
      }

      return <DataTable columns={cols} rows={data} className={styles.cardRow} common={common} />;
  };

  render() {
    const { cols, rows, type, common } = this.props;

    return (
      <div className={styles.deviceContainer}>
        <DataTable columns={cols} rows={rows} className={styles.tableContainer} common={common} />
        {this.createCardView(rows, type, cols, common)}
      </div>
    );
  }
}
