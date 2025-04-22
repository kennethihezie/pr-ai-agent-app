import { MiddlewareConsumer, Module, NestMiddleware, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { AppExceptionFilter } from 'src/shared/exception/app_exception_flter';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { LoggerMiddleware } from 'src/shared/middleware/logger.middleware';
import { XssMiddleware } from 'src/shared/middleware/xss.middleware';
import { SanitizeMiddleware } from 'src/shared/middleware/sanitize.middleware';
import { AuthModule } from './auth/auth.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/common/config/config';
import { mongodbConfig } from 'src/common/database/mongodb';
import { HttpClientModule } from './http-client/http-client.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from 'src/common/cache/redis';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(config.db.dbUrl, mongodbConfig),
    CacheModule.registerAsync({
      useFactory: redisConfig,
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //60 seconds
        limit: 50, //100 requests
      },
    ]),
    AuthModule,
    AiAgentModule,
    HttpClientModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter
    },

    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: false, transform: true, transformOptions: {
          enableImplicitConversion: true,
        },
      })
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },

    AppService
  ],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
    consumer.apply(SanitizeMiddleware).forRoutes('*')
    consumer.apply(XssMiddleware).forRoutes('*')
  }

}
