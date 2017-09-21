import superagent from 'superagent';
import { apiBasePath, auth } from 'config';

const { clientId, clientSecret } = auth;


const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;

  if (/^https?:/.test(path)) {
    return path;
  }

  // Prepend `/api` to relative URL, to proxy to API server.
  return apiBasePath + adjustedPath;
}

export default class ApiClient {
  constructor(req) {
    methods.forEach((method) => {
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));
        const token = localStorage.getItem('useraccess');

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (token) {
          const expiry = localStorage.getItem('userexpiry');

          request.set('Authorization', `Bearer ${token}`);
          if (expiry < Date.now()) {
            localStorage.clear();
            reject({ status: 0, error_msg: 'Session expired. Please log in.' });

            return;
          }
        }
        if (path.search("/auth/token") > 0 ) {
          const authToken = btoa(`${clientId}:${clientSecret}`);

          request.url = "/api/auth/token";
          let formBody = [];
          const dataArray = Object.keys(data);
          request.set('Authorization', `Basic ${authToken}`);
          dataArray.forEach((property) => {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(data[property]);

            formBody.push(`${encodedKey}=${encodedValue}`);
          });
          formBody = formBody.join('&');
          request.send(formBody);
        }

        if (data) {
          request.send(data);
        }

        request.end((err, res) => {
          const body = res && res.body || {};

          if (err) {
            const resp = body ? { ...body, statusCode: res && res.status } : err;

            reject(resp);
          } else {
            resolve(body);
          }
        });
      });
    });
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {} // eslint-disable-line class-methods-use-this
}
