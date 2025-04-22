import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/modules/users/service/users.service";
import { ErrorCode } from "src/shared/enums/error-codes.enum";
import AppError from "src/shared/helpers/app-error";
import { JwtPayload } from "src/shared/types/jwt.type";

// Defines a Strategy for RefreshTokenStrategy

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: JwtPayload) {
        const { userId } = payload

        const user = await this.usersService.getUser(userId, true)

        const refreshToken = req.get('Authorization').replace('Bearer', '').trim()

        if (refreshToken !== user.refreshToken) throw new AppError(ErrorCode['0003'], 'Invalid refresh token')
          
        return user
    }
}