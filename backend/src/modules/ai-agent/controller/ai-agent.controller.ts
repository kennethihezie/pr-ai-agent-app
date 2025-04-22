import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AnalyzePrDto, PrConfigDto } from '../dto/analyze-pr.dto';
import { ResponseMessage } from 'src/shared/decorators/response_message.decorator';
import { AccessTokenGuard } from 'src/modules/auth/guard/access_token.guard';
import { CurrentUser } from 'src/shared/decorators/current_user.decorator';
import { CurrentUserData } from 'src/shared/types/jwt.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AiAgentService } from '../services/ai-agent/ai-agent.service';

@ApiTags('Ai Agent')
@ApiBearerAuth('JWT')
@UseGuards(AccessTokenGuard)
@Controller('ai-agent')
export class AiAgentController {
    constructor(private readonly aiAgentService: AiAgentService) {}

    @ResponseMessage('Pull request analyzed successfully')
    @Post('analyze-pr')
    async getPullRequestDetails(@Body() body: AnalyzePrDto, @Query() query: PrConfigDto, @CurrentUser() user: CurrentUserData) {
      return this.aiAgentService.getPrAnalysisUsingAiAgent(body, query, user);
    }
}
