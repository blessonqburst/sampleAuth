import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { appRoutes } from 'config';
import Helmet from 'react-helmet';
import styles from './User.scss';
import DateTime from 'react-datetime';
import DropDown, { DropDownItem } from 'components/DropDown/DropDown';
import TextContainer from 'components/TextContainer/TextContainer';
import MenuButton from 'components/MenuButton/MenuButton';
import Link from 'components/Link/Link';
import classnames from 'classnames';
import { loadUserById, updateUser, addUser, addClientUser } from 'redux/modules/users';
import { loadClientRoles } from 'redux/modules/clients';
import { browserHistory } from 'react-router';

const { func, object, arrayOf } = PropTypes;
const { clients: clientUrl } = appRoutes;

const calendarClass = classnames(styles.datepicker, 'fa fa-calendar');
const yesterday = DateTime.moment().subtract(1, 'day');
const isFutureDate = current => current.isBefore(yesterday);
const nations = [ "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe" ];
const initialState = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  contact: '',
  gender: '',
  dob: '',
  nationality: '',
  address: '',
  error: '',
  role: '',
};

@connect(state => ({
  users: state.users,
  user: state.users.data,
  clientRoles: state.clients.clientRoles,
}),
{
  loadUserById,
  updateUser,
  addUser,
  loadClientRoles,
  addClientUser,
})

export default class UserForm extends Component {
  static propTypes = {
    loadUserById: func,
    user: object,
    updateUser: func,
    addUser: func,
    loadClientRoles: func,
    clientRoles: arrayOf(object),
    addClientUser: func,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    ...initialState,
  };

  componentWillMount() {
    const {params: {userId}, loadUserById, user, location, loadClientRoles } = this.props;
    if (userId) {
        loadUserById(userId);
    }
    if (location.query.client_id && !userId) {
      loadClientRoles(location.query.client_id);
    }
  }

  componentWillReceiveProps(nextProps) {
      const { params: { userId }, user } = nextProps;

      if(userId) {
        this.setState({
          name: user.name,
          email: user.email,
          contact: user.contact,
          gender: user.gender,
          dob: user.dob? new Date(user.dob).getTime() : '',
          nationality: user.nationality,
          address: user.address,
        });
      } else {
        this.setState({
          ...initialState,
        });
      }
  }

  handleChange = name => event => {
    const { value } = event.target;
    this.setState({ [name]: value });
    if (name === 'confirmPassword') {
      const { password, error } = this.state;
      value===password ? this.setState({ error: null }) : this.setState({ error: "Password doesn't match" });
    }
  }

  handleDateChange = name => (date) => {
  if (typeof date === 'object') {
    this.setState({ [name]: new Date(date).getTime(), errors: [] });
  } else {
      this.setState({ [name]: '' });
    }
  };

  handleSubmit = (event) => {
    const { params: { userId }, updateUser, addUser, addClientUser } = this.props;
    const { client_id, redirect_uri } = this.props.location.query;
    event.preventDefault();
    if (userId) {
      updateUser(userId, {...this.state}, client_id, redirect_uri);
    } else {
      addUser({...this.state}, client_id);
    }
  }

  goToPreviousLocation = (event) => {
    event.preventDefault();
    const { redirect_uri } = this.props.location.query;
    if (redirect_uri) {
      window.location.assign(redirect_uri);
    } else {
      browserHistory.goBack();
    }
  }

  render() {
    const { email: iemail, username: iname, password: ipassword, confirmPassword: iconfirmPassword, contact: icontact } = this.context.i18n;
    const { params: {userId}, clientRoles } = this.props;
    const { email, name, password, confirmPassword, contact, gender, dob, nationality, address, error, role } = this.state;

    return (
      <div className={styles.loginWrapper}>
        <Helmet title={ userId ? 'EDIT USER' : 'ADD USER' } />
          <form className={styles.loginForm} name="form" role="form" onSubmit={this.handleSubmit} >
            <div className={styles.loginHead}>{ userId ? 'EDIT USER' : 'ADD USER' }</div>
            <div className={styles.formContainer}>
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label={iname}
                onChange={this.handleChange('name')}
                value={name}
                required
              />
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label={iemail}
                onChange={this.handleChange('email')}
                value={email}
                required
              />
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label={ipassword}
                type='password'
                onChange={this.handleChange('password')}
                value={password}
                required={!userId}
              />
              { error ? <label className={styles.errorMsg}>{error|| error.data}</label> : null }
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label={iconfirmPassword}
                type='password'
                onChange={this.handleChange('confirmPassword')}
                value={confirmPassword}
                required={!userId}
              />
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label={icontact}
                onChange={this.handleChange('contact')}
                value={contact}
              />
              <DropDown name='gender' heading='Gender' className={classnames(styles.dropdown, styles.loginInput)} onChange={this.handleChange('gender')} defaultValue={gender}>
                {!userId || !gender ? <DropDownItem label='Select any' value='' /> : null}
                <DropDownItem label='Male' value='male' />
                <DropDownItem label='Female' value='female' />
                <DropDownItem label='Others' value='others' />
              </DropDown>
              <DropDown name='nationality' heading='Nationality' className={classnames(styles.dropdown, styles.loginInput)} onChange={this.handleChange('nationality')} defaultValue={nationality}>
                {!userId || !nationality ? <DropDownItem label='Select any' value='' /> : null}
                {
                  nations.map((nation) =>
                    <DropDownItem value={nation} key={nation} label={nation} />
                  )
                }
              </DropDown>
              <div className={styles.dateContainer}>
                <label htmlFor='dob'>Date Of Birth</label>
                <DateTime
                  dateFormat='DD-MM-YYYY'
                  timeFormat={false}
                  name='dob'
                  isValidDate={isFutureDate}
                  id='dob'
                  onChange={this.handleDateChange('dob')}
                  closeOnSelect
                  className={calendarClass}
                  value={dob}
                />
              </div>
              <TextContainer
                className={classnames(styles.textInput, styles.loginInput)}
                label={'Address'}
                onChange={this.handleChange('address')}
                value={address}
              />
              { clientRoles && clientRoles.length>0 ?
                <DropDown name='role' heading='Role' className={classnames(styles.dropdown, styles.loginInput)} onChange={this.handleChange('role')} >
               <DropDownItem label='Select any' value='' />
                {
                  clientRoles.map((role) => <DropDownItem value={role._id} key={role._id} label={role.role_description} />)
                }
                </DropDown>
                : null
              }
              <div className={styles.buttonContainer}>
                <MenuButton
                  label={userId ? 'Update' : 'Submit'}
                  className={styles.loginBtn}
                  type='submit'

                />
                <MenuButton
                  label="Cancel"
                  className={classnames(styles.loginBtn, styles.cancel)}
                  type='button'
                  onClick={this.goToPreviousLocation}
                />
              </div>
            </div>
          </form>
      </div>
    );
  }
}
