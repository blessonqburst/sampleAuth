import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { appRoutes } from 'config';
import Helmet from 'react-helmet';
import classnames from 'classnames';

import Device from 'components/Device/Device';
import Card, { CardHeader } from 'components/Card';
import TextContainer from 'components/TextContainer/TextContainer';
import Modal from 'components/Model/Model';
import MenuButton from 'components/MenuButton/MenuButton';
import BreadCrumb from 'components/BreadCrumb/BreadCrumb';
import Link from 'components/Link/Link';
import { loadProfile } from 'redux/modules/profile';
import styles from './Profile.scss';

const { object, arrayOf, func } = PropTypes;

const { profile: profileUrl, users: userUrl } = appRoutes;

@connect(state => ({
  user: state.auth.user,
  profileData: state.profile.data
}), {
  loadProfile,
})
export default class Profile extends Component {
  static propTypes = {
    loadProfile: func,
    profileData: object,
    user: object,
  }

  static contextTypes = {
    router: object,
    i18n: object,
  };

  componentDidMount() {
    this.props.loadProfile(this.props.user.user_id);
  }

  editCustomUser = () => {
    const { router } = this.context;
    event.stopPropagation();
    router.push(`/${userUrl.link}/${this.props.user.user_id}`);
  }

  render() {
    const { profileData: user } = this.props;
    const { avatar } = user;

    return (
      <div className={styles.userContainer}>
        <Helmet title="My Profile" />
        <div className={styles.pageHead}>
          <BreadCrumb className={styles.breadCrumb} skipLevel={1} />
          <Link label="Edit User" to={`/${userUrl.link}/${this.props.user.user_id}`} className={styles.editClient} />
        </div>
        <div className={styles.container}>
          <div className={styles.labelContainer} >
            <label className={styles.name}>{user.name}</label>
          </div>
          <div className={styles.infoContainer} >
            <div className={styles.left}>
              <div className={styles.imageField}>
                {
                  avatar
                  ? <img src={avatar} alt="user icon" className={styles.imgSpace}/>
                : <i className={classnames(styles.userIcon, 'fa fa-user', styles.imgSpace)} aria-hidden="true" />
                }
              </div>
            </div>
            <div className={styles.right}>
                <form className={styles.form}>
                  <div className={styles.row}>
                    <TextContainer className={styles.textInput} label="Email:" value={user.email || ''} readOnly />
                    <TextContainer className={styles.textInput} label="Gender:" value={user.gender || ''} readOnly />
                  </div>
                  <div className={styles.row}>
                    <TextContainer className={styles.textInput} label="Contact:" value={user.contact || ''} readOnly />
                    <TextContainer className={styles.textInput} label="Nationality:" value={user.nationality || ''} readOnly />
                  </div>
                  <div className={styles.row}>
                    <TextContainer className={styles.textInput} label="Address:" value={user.address || ''} readOnly />
                    <TextContainer className={styles.textInput} label="Date of Birth:" value={user.dob || ''} readOnly />
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>
      );
  }
}
