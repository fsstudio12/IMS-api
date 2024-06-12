import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';

import config from './config/config';
import { morgan } from './modules/logger';
import { jwtStrategy } from './modules/auth';
import { authLimiter } from './modules/utils';
import { ApiError, errorConverter, errorHandler } from './modules/errors';
import routes from './routes/v1';

const app: Express = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());

app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '100mb' }));

app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());

app.use(compression());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    const payloadSizeBytes = JSON.stringify(req.body).length;
    const payloadSizeMB = payloadSizeBytes / (1024 * 1024);
    console.log('Payload size:', payloadSizeMB.toFixed(2), 'MB');
  }
  next();
});

app.get('/', () => console.log('wadu'));
app.use('/v1', routes);

app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
