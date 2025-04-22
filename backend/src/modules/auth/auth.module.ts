import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy } from './strategies/access_token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh_token.strategy';

@Module({
  imports: [ JwtModule.register({}), UsersModule ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
