import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { CurrentUserData } from "../types/jwt.type";

/*
 Provides the current authenticated user across the app.
 */

export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as Request        
    return request.user as CurrentUserData
})