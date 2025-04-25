import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${method} ${originalUrl}`);

    // Track response time
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${timestamp}] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
