import { apiBasePath, previewBase, generateURL, authClientBase, authBase } from './api';
import access from './access';
import appRoutes from './routes';

/**
* Required as Karma doesn't support some of the new features
* of JavaScript by itself. eg: Promise
*/

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];
const mobileWidth = 960;

const configuration = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  access,
  appRoutes,
  app: {
    title: 'Secure Homes',
    description: 'Secure Homes',
    head: {
      titleTemplate: 'Secure Homes: %s',
      meta: [
        { name: 'description', content: 'Secure Homes' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'Secure Homes' },
        { property: 'og:image', content: 'http://www.qburst.com/images/responsive/QBlogo.svg' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'Secure Homes' },
        { property: 'og:description', content: 'Secure Homes' },
        { property: 'og:card', content: 'summary' },
        { property: 'og:site', content: '@qburst' },
        { property: 'og:creator', content: '@qburst' },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' }
      ]
    },
    footer: 'Copyright (c) 2017 Secure Homes. All Rights Reserved',
  },
  apiBasePath,
  auth: {
    clientId: 'default_client',
    clientSecret: 'default_secret',
  },
  authClientBase,
  authBase,
  previewBase,
  generateURL,
  mobileWidth,
  ...environment,
};

export default configuration;
