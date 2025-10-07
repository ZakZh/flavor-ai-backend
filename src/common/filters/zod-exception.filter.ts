import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const zodError = exception.getZodError() as ZodError<any>;
    
    const errors = zodError.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors,
    });
  }
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as any;
    
    // Check if this is a ZodValidationException with proper error structure
    if (exceptionResponse && exceptionResponse.errors && Array.isArray(exceptionResponse.errors)) {
      // Format Zod errors to match frontend expectations
      const errors = exceptionResponse.errors.map((err: any) => ({
        path: Array.isArray(err.path) ? err.path.join('.') : err.path || 'general',
        message: err.message,
      }));

      return response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        errors,
      });
    }
    
    // Handle array of error messages
    if (exceptionResponse && Array.isArray(exceptionResponse.message)) {
      const errors = exceptionResponse.message.map((msg: string) => ({
        path: 'general',
        message: msg,
      }));

      return response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        errors,
      });
    }

    // Default handling for other BadRequestExceptions
    response.status(status).json({
      statusCode: status,
      message: exceptionResponse.message || exception.message,
    });
  }
}


