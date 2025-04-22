import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { ResponseMessage } from 'src/shared/decorators/response_message.decorator';
import { LoginDto } from '../dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ResponseMessage('User signed up successfully')
  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body)
  }

  @ResponseMessage('User logged in successfully')
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}
