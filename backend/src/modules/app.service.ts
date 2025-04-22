import { Injectable } from '@nestjs/common';
import { AppCodes } from 'src/shared/constants/app_code';

@Injectable()
export class AppService {
  healthCheck(): string {
    return 'App is running';
  }
}
