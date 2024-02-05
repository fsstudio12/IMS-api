import { Request } from 'express';

import { IUserDoc } from '../user/user.interfaces';

export type VerifyCallback = (
  req: Request,
  resolve: (value?: void | PromiseLike<void>) => void,
  reject: (reason?: any) => void,
  requiredRights: string[]
) => (err: Error, user: IUserDoc, info: string) => void;
