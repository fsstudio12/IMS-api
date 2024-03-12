import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import { roleRights } from '../../config/roles';
import { IEmployeeDoc } from '../employee/employee.interfaces';
import { VerifyCallback } from './auth.interface';

const verifyCallback: VerifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, employee: IEmployeeDoc, info: string) => {
    if (err || info || !employee) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.employee = employee;

    if (employee.role !== 'super_admin' && requiredRights.length) {
      const employeeRights = roleRights.get(employee.role);
      if (!employeeRights) return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      const hasRequiredRights = requiredRights.every((requiredRight: string) => employeeRights.includes(requiredRight));
      if (!hasRequiredRights && req.params['employeeId'] !== employee.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> =>
    new Promise<void>((resolve: (value?: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;
