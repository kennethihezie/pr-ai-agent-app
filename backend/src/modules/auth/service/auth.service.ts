import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { Encryption } from 'src/shared/helpers/encryption';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/shared/types/jwt.type';
import { config } from 'src/common/config/config';
import AppError from 'src/shared/helpers/app-error';
import { ErrorCode } from 'src/shared/enums/error-codes.enum';
import { UsersService } from 'src/modules/users/service/users.service';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }

    async signUp(payload: SignUpDto) {
        const data = { ...payload, password: await Encryption.hashData(payload.password), githubAccessKey: Encryption.encryptData(payload.githubAccessKey) }
        const { _id, username } = await this.userService.createUser(data)

        const jwtPayload: JwtPayload = { userId: _id.toString(), username }

        const accessToken = await this.accessToken(jwtPayload)
        const refreshToken = await this.refreshToken(jwtPayload)

        await this.userService.updateUser(_id.toString(), { accessToken, refreshToken })

        return {
            id: _id,
            username,
            accessToken,
            refreshToken
        }
    }

    async login({ username, password }: LoginDto) {
        const user = await this.userService.getUserByUsername(username, true)

        if (!user) throw new AppError(ErrorCode['0003']);

        if(!(await Encryption.verifyData(user.password, password))) throw new AppError(ErrorCode['0004'], "Invalid login credentials")

        const jwtPayload: JwtPayload = { userId: user._id.toString(), username }

        const accessToken = await this.accessToken(jwtPayload)
        const refreshToken = await this.refreshToken(jwtPayload)

        await this.userService.updateUser(user._id.toString(), { accessToken, refreshToken })

        return {
            id: user._id,
            username,
            accessToken,
            refreshToken
        }
    }

    private async accessToken(payload: JwtPayload): Promise<string> {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: config.jwt.secret,
            expiresIn: config.jwt.expiryTime
        })

        return accessToken
    }

    private async refreshToken(payload: JwtPayload): Promise<string> {
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: config.jwt.refreshTokenSecret,
            expiresIn: config.jwt.refreshTokenExpiryTime
        })

        return refreshToken
    }
}
