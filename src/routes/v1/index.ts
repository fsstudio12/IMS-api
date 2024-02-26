import express, { Router } from 'express';
import config from '../../config/config';

import docsRoute from './swagger.route';

import adminRoute from './admin.route';
import authRoute from './auth.route';
import businessRoute from './business.route';
import categoryRoute from './category.route';
import itemRoute from './item.route';
import recipeRoute from './recipe.route';
import userRoute from './user.route';
import vendorRoute from './vendor.route';

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
    path: '/items',
    route: itemRoute,
  },
  {
    path: '/recipes',
    route: recipeRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/vendors',
    route: vendorRoute,
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
