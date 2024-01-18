require('jest');
const AppError = require('../../src/errors/AppError');

describe('AppError', () => {
    test('should create an instance of AppError with the correct properties', () => {
      const errorMessage = 'Test error';
      const httpStatus = 500;
  
      const appError = new AppError(errorMessage, httpStatus);
  
      expect(appError).toBeInstanceOf(AppError);
      expect(appError.message).toBe(errorMessage);
      expect(appError.httpStatus).toBe(httpStatus);
    });
  
    test('should send HTTP response with the correct status and JSON body', () => {
      const errorMessage = 'Test error';
      const httpStatus = 404;
  
      const appError = new AppError(errorMessage, httpStatus);
      const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
      };
  
      appError.sendHttpResponse(res);
  
      expect(res.status).toHaveBeenCalledWith(httpStatus);
      expect(res.send).toHaveBeenCalledWith(appError.toJSON());
    });
  
    test('should format the error to JSON', () => {
      const errorMessage = 'Test error';
      const httpStatus = 403;
  
      const appError = new AppError(errorMessage, httpStatus);
      const jsonResult = appError.toJSON();
  
      expect(jsonResult).toEqual({ message: errorMessage });
    });
});