import { Injectable } from "@nestjs/common";
import { PrAnalysisService } from "../pr-analysis/pr-analysis.service";
import { CurrentUserData } from "src/shared/types/jwt.type";
import { AnalyzePrDto, PrConfigDto } from "../../dto/analyze-pr.dto";

@Injectable()
export class AiAgentService {
    constructor(private readonly prAnalysisService: PrAnalysisService) { }

    async getPrAnalysisUsingAiAgent(payload: AnalyzePrDto, configPayload: PrConfigDto, user: CurrentUserData) {
        return await this.prAnalysisService.analyzePullRequest(payload, configPayload, user)
    }
}