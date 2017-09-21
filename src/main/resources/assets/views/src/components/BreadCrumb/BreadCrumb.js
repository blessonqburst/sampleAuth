/**
 * BreadCrumb component
 * Description:
 *   Read the location from context and construct the crumbs using the route config.
 *   Last crumb will not have active link.
 * Usage:
 *   General:
 *     <BreadCrumb />
 * Props Details:
 *  skipLevel - Specify the nesting level to include in crumb. 0, 1, 2.
 *  pageCrumb - Page specific crumb in addition to the route based crumb { to: '', label: 'label you need' }.
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { appRoutes } from 'config';
import Link from '../Link/Link';
import styles from './BreadCrumb.scss';

const { object, string, number, shape, oneOfType, arrayOf } = PropTypes;

/**
 * Generate the crumb items using the parent root link.
 * @returns array of object of shape { to: 'link', label: 'string' }
 */
const generateCrumb = (route, routeObj, root = '') => {
  let crumb = [];

  if (!routeObj) return crumb;

  // loop through each route to find the mapping path.
  Object.keys(routeObj).forEach((key) => {
    const { link, label, children, showCrumb } = routeObj[key];
    const absoluteLink = `${root}/${link}`;

    // links are matching. stop the propagation.
    if (absoluteLink === route) {
      crumb.push({ to: absoluteLink, label });
    } else if (route.indexOf(absoluteLink) === 0 && (children || showCrumb)) {
      // links are partial match. and it has a children or showCrumb is enabled.
      crumb = [...crumb, { to: absoluteLink, label }, ...generateCrumb(route, children, absoluteLink)];
    }
  });

  // to filter out the empty values.
  return crumb.filter(valid => valid);
};

// BreadCrumb Component
const BreadCrumb = ({ className, skipLevel, pageCrumb }, { location }) => {
  const { pathname } = location;
  let crumbs = generateCrumb(pathname, appRoutes);

  // if pageCrumb exist add it into the generated crumbs.
  if (Array.isArray(pageCrumb)) {
    crumbs = [...pageCrumb];
  } else if (pageCrumb) {
    crumbs.push(pageCrumb);
  }

  const totalCrumb = skipLevel || crumbs.length;

  // need to take only the requested level.
  crumbs.splice(totalCrumb);

  return (
    <div className={classnames(styles.crumbContainer, className)}>
      {
        crumbs.map((crumb, index) => {
          if (index === totalCrumb - 1) {
            return (<span className={classnames(styles.crumb, styles.leafLevel)} key={index}> {crumb.label}</span>);
          }

          return (
            <span key={index}>
              <Link className={classnames(styles.crumb, styles.interLevel)} label={`${crumb.label}`} to={crumb.to} />
              /
            </span>
          );
        })
      }
    </div>
  );
};

BreadCrumb.propTypes = {
  className: string,
  pageCrumb: oneOfType([shape({ to: string, label: string }), arrayOf(shape({ to: string, label: string }))]),
  skipLevel: number,
};

BreadCrumb.contextTypes = {
  location: object,
};

export default BreadCrumb;
