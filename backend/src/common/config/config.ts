import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { EnvironmentType } from 'src/shared/enums/environment.enum';

dotenv.config();

const configService: ConfigService = new ConfigService();

export const config = {
    app: {
        displayName: configService.get<string>('APP_DISPLAY_NAME') || 'PR AI AGENT',
        port: configService.get<number>('APP_PORT') || 3000,
        env: configService.get<EnvironmentType>('APP_ENV'),
        apiVersion: configService.get<string>('APP_API_VERSION') || '1.0.0',
    },
    github: {
        baseUrl: configService.get<string>('GITHUB_BASE_URL')
    },
    aws: {
        accessKey: configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
        region: configService.get<string>('AWS_REGION'),
        aiAgent: configService.get<string>('AWS_CLAUDE_AI_ARN'),
        modelVersion: configService.get<string>('AWS_MODEL_VERSION'),
        modelMaxToken: configService.get<number>('AWS_MODEL_MAX_TOKEN'),
        topK: configService.get<number>('AWS_TOP_K'),
        temperature: configService.get<number>('AWS_MODEL_TEMPERATURE'),
        topP: configService.get<number>('AWS_TOP_P')
    },
    jwt: {
        expiryTime: configService.get<string>('JWT_EXPIRY_TIME'),
        secret: configService.get<string>('JWT_SECRET'),
        refreshTokenExpiryTime: configService.get<string>('JWT_REFRESH_TOKEN_EXPIRY_TIME'),
        refreshTokenSecret: configService.get<string>('JWT_REFRESH_SECRET'),
    },
    db: {
        dbUrl: configService.get<string>('DB_URL'),
        dbName: configService.get<string>('DB_NAME'),
        dbUserName: configService.get<string>('DB_USER_NAME'),
        dbPassword: configService.get<string>('DB_PASS'),
    },
    redis: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: configService.get<number>('REDIS_TTL'),
    },
    crypto: {
        privateKey: configService.get<string>('PRIVATE_KEY'),
        publicKey: configService.get<string>('PUBLIC_KEY')
    }
};