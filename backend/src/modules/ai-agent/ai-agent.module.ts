import { Module } from '@nestjs/common';
import { AiAgentController } from './controller/ai-agent.controller';
import { PrAnalysisService } from './services/pr-analysis/pr-analysis.service';
import { AwsBedrockService } from 'src/shared/aws/aws-bedrock';
import { CacheService } from 'src/shared/services/redis.service';
import { AiAgentService } from './services/ai-agent/ai-agent.service';

@Module({
  controllers: [AiAgentController],
  providers: [AiAgentService, PrAnalysisService, AwsBedrockService, CacheService]
})
export class AiAgentModule {}
