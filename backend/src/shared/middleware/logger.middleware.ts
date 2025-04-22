
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}

  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, query, body } = req;
    const start = Date.now();

    this.logger.log(
        `
        Incoming Request: ${method} ${originalUrl}\n
        -----------------------------------
        Headers: ${JSON.stringify(headers)}\n
        -----------------------------------
        Query Params: ${JSON.stringify(query)}\n
        -------------------------------------
        Request Body: ${JSON.stringify(body)}
        `
    );

    res.on('finish', () => {
        const { statusCode } = res;
        const elapsedTime = Date.now() - start;
        this.logger.log(
        `
        ---------------------------------------
        Endpoint: ${method} ${originalUrl}\n
        ---------------------------------------
        Response status code: ${statusCode}\n
        ------------------------------
        Elapsed time: ${elapsedTime}ms
        `
        );
    });

    next();
  }
}
