import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from 'express';
import xss from 'xss';

@Injectable()
export class XssMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.xss = xss;
    next();
  }
}