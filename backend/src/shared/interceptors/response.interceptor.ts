import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Observable, map } from "rxjs"
import { Reflector } from '@nestjs/core';
import { AppResponse } from "../interfaces/response.interface";
import { ResponseFormat } from "../helpers/response_format";


/*
Handles all outgoing responses and formats the data.
*/

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, AppResponse<T>> {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<AppResponse<T>> | Promise<Observable<AppResponse<T>>> {
        return next.handle().pipe(map((data: T) => ResponseFormat.handleSuccessResponse<T>(context, this.reflector, data)))
    }
}