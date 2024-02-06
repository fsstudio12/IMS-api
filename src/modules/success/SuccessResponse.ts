import { SuccessResponseData } from './success.interfaces';

const createSuccessResponse = (data?: any, message?: string): SuccessResponseData => {
  const responseData: SuccessResponseData = {
    success: true,
  };

  if (message) {
    responseData.message = message;
  }

  if (data) {
    responseData.data = {
      ...data,
    };
  }

  return responseData;
};

export default createSuccessResponse;
