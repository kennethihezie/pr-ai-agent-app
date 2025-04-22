import { Response, Request } from "express"
import { RESPONSE_MESSAGE } from "../decorators/response_message.decorator"
import { ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AppCodes } from "../constants/app_code"

/*
 The ResponseFormat class is used to handle 
 both error and successful response in a unified way.
 */

export class ResponseFormat {
    static handleErrorResponse(request: Request, response: Response, message: string | object, statusCode: number) {
      let formattedMessage

       if(message instanceof Object){
        formattedMessage = message['message']
       }

        return response.status(statusCode).json({
            statusCode: statusCode,
            status: AppCodes.FAIL,
            timeStamp: new Date().toISOString(),
            path: request.url,
            message: formattedMessage ?? message
        })
    }

    static handleSuccessResponse<T>(context: ExecutionContext, reflector: Reflector, data: T) {
        return {
            statusCode: context.switchToHttp().getResponse<Response>().statusCode,
            status: AppCodes.SUCCESSFUL,
            message: reflector.getAllAndOverride<string>(RESPONSE_MESSAGE, [
                context.getHandler(),
                context.getClass()
            ]),
            data: data
        }
    }
}