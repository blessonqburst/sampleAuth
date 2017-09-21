import Request from 'superagent';
import api from '../config/api';

export default {
  login: (email, password, clientId) => Request
    .post(api.baseUrl + api.login)
    .query({ email, password, clientId })
    .end((err, res) => {})
};