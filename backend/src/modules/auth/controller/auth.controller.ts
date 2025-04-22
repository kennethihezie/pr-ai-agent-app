import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { ResponseMessage } from 'src/shared/decorators/response_message.decorator';
import { LoginDto } from '../dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Throttle({ default: { limit: 1, ttl: 1000 } })
  @ResponseMessage('User signed up successfully')
  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body)
  }

  @Throttle({ default: { limit: 1, ttl: 1000 } })
  @ResponseMessage('User logged in successfully')
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}
