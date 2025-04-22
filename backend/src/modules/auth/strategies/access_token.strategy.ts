import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from "express";
import { UsersService } from "src/modules/users/service/users.service";
import { JwtPayload } from "src/shared/types/jwt.type";
import AppError from "src/shared/helpers/app-error";
import { ErrorCode } from "src/shared/enums/error-codes.enum";
import { Encryption } from "src/shared/helpers/encryption";

// Defines a Strategy for AccessTokenStrategy

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: JwtPayload) {
        const { userId } = payload
                
        const user = await this.usersService.getUser(userId, true)

        const token = req.get('Authorization').replace('Bearer', '').trim()        

        if (user.accessToken !== token) throw new AppError(ErrorCode['0003'], 'Invalid access token')
          
        return {...user, githubAccessKey: Encryption.decryptData(user.githubAccessKey) }
    }
}