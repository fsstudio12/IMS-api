import express, { Router } from 'express';
import config from '../../config/config';

import docsRoute from './swagger.route';

import adminRoute from './admin.route';
import authRoute from './auth.route';
import businessRoute from './business.route';
import categoryRoute from './category.route';
import customerRoute from './customer.route';
import departmentRoute from './department.route';
import employeeRoute from './employee.route';
import itemRoute from './item.route';
import purchaseRoute from './purchase.route';
import recipeRoute from './recipe.route';
import salesRoute from './sales.route';
import vendorRoute from './vendor.route';
import wastageRoute from './wastage.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/businesses',
    route: businessRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/customers',
    route: customerRoute,
  },
  {
    path: '/departments',
    route: departmentRoute,
  },
  {
    path: '/employees',
    route: employeeRoute,
  },
  {
    path: '/items',
    route: itemRoute,
  },
  {
    path: '/purchases',
    route: purchaseRoute,
  },
  {
    path: '/recipes',
    route: recipeRoute,
  },
  {
    path: '/sales',
    route: salesRoute,
  },
  {
    path: '/vendors',
    route: vendorRoute,
  },
  {
    path: '/wastages',
    route: wastageRoute,
  },
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
