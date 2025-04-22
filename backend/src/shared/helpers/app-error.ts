import { ErrorResponseCodes } from "./response-code";

class AppError extends Error {
  message: string;
  isOperational: boolean;
  responseCode: string;
  responseBody: any;

  constructor(responseCode: string, message?: string) {
    super();

    this.isOperational = true;
    this.message = message ? message : ErrorResponseCodes[responseCode].message;
    this.responseCode = responseCode;
    this.responseBody = ErrorResponseCodes[responseCode];

    Error.captureStackTrace(this, this.constructor);
  }

  httpStatus() {
    switch (this.responseBody.code) {
      case '00':
        return 201;
      case '01':
        return 200;
      case '02':
        return 400;
      case '03':
        return 404;
      case '04':
        return 401;
      case '05':
        return 400;
      case '07':
        return 403;
      default:
        return 500;
    }
  }
}

export default AppError;
