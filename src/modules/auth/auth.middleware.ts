import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import { IEmployeeForAuth } from '../employee/employee.interfaces';
import { VerifyCallback } from './auth.interface';
import Resource from '../../config/resources';
import Action from '../../config/actions';

const verifyCallback: VerifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: Record<Resource, Action[]>) =>
  async (err: Error, employee: IEmployeeForAuth, info: string) => {
    if (err || info || !employee) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.employee = employee;

    if (employee.role !== 'super_admin' && Object.keys(requiredRights).length > 0) {
      const employeePermissions = employee.department.permissions;
      if (!employeePermissions)
        return reject(new ApiError(httpStatus.FORBIDDEN, 'You do not have the permissions to access this resource.'));

      for (const resource in requiredRights) {
        if (Object.prototype.hasOwnProperty.call(requiredRights, resource)) {
          const actions = requiredRights[resource as Resource];
          const resourcePermissions = employeePermissions[resource as Resource] || [];

          const hasRequiredRights =
            resourcePermissions.includes(Action.ALL) ||
            actions.every((action: Action) => resourcePermissions.includes(action));
          if (!hasRequiredRights) {
            return reject(new ApiError(httpStatus.FORBIDDEN, 'You do not have the permissions to access this resource.'));
          }
        }
      }
    }

    resolve();
  };

const getDefaultRights = (): Record<Resource, Action[]> => {
  const defaultRights: Record<Resource, Action[]> = {} as Record<Resource, Action[]>;
  for (const resource in Resource) {
    if (Object.prototype.hasOwnProperty.call(Resource, resource)) {
      defaultRights[resource as Resource] = [];
    }
  }
  return defaultRights;
};

const authMiddleware =
  (requiredRights: Record<Resource, Action[]> = getDefaultRights()) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> =>
    new Promise<void>((resolve: (value?: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;
