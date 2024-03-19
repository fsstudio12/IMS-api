import { Request } from 'express';

import { IEmployeeForAuth } from '../employee/employee.interfaces';
import Resource from '../../config/resources';
import Action from '../../config/actions';

export type VerifyCallback = (
  req: Request,
  resolve: (value?: void | PromiseLike<void>) => void,
  reject: (reason?: any) => void,
  requiredRights: Record<Resource, Action[]>
) => (err: Error, user: IEmployeeForAuth, info: string) => void;
