import { IEmployeeForAuth } from './modules/employee/employee.interfaces';

declare module 'express-serve-static-core' {
  export interface Request {
    employee: IEmployeeForAuth;
  }
}
