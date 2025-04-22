import { Injectable } from '@nestjs/common';
import { Helpers } from '../../../../shared/helpers/helper';
import { AnalyzePrDto, PrConfigDto } from '../../dto/analyze-pr.dto';
import { CurrentUserData } from '../../../../shared/types/jwt.type';
import { HttpClientService } from '../../../http-client/http-client.service';
import { AwsBedrockService } from '../../../../shared/aws/aws-bedrock';
import { config } from '../../../../common/config/config';
import { PRData } from '../../../../shared/interfaces/pr-data.interface';
import { AnalysisOptions } from '../../../../shared/interfaces/analysis-option.interface';
import AppError from '../../../../shared/helpers/app-error';
import { ErrorCode } from '../../../../shared/enums/error-codes.enum';
import { CacheService } from '../../../../shared/services/redis.service';

@Injectable()
export class PrAnalysisService {
    constructor(private readonly httpClientService: HttpClientService, private readonly awsBedrockService: AwsBedrockService, private readonly cacheService: CacheService) { }

    async analyzePullRequest({ prUrl }: AnalyzePrDto, query: PrConfigDto, user: CurrentUserData) {
        const { owner, repo, pull_number } = Helpers.parsePRUrl(prUrl);

        const githubBaseUrl = config.github.baseUrl
        const bearerToken = `Bearer ${user.githubAccessKey}`        

        const activeOptions = Helpers.getActiveAnalysisOptionsString(query)
        const key = `${pull_number}_${repo}_${owner}_${activeOptions}`
        
        const [pr, files, commits] = await Promise.all([
            this.httpClientService.get(`${githubBaseUrl}/${owner}/${repo}/pulls/${pull_number}`, { Authorization: bearerToken }) as any,
            this.httpClientService.get(`${githubBaseUrl}/${owner}/${repo}/pulls/${pull_number}/files`, { Authorization: bearerToken }) as any,
            this.httpClientService.get(`${githubBaseUrl}/${owner}/${repo}/pulls/${pull_number}/commits`, { Authorization: bearerToken }) as any
        ])

        if (pr.state !== 'open') throw new AppError(ErrorCode['0002'], 'Please submit an open pull request')

        const prompt = this.generatePrompt({ title: pr.title, body: pr.body, author: pr.user.login, branch: pr.head.ref, base: pr.base.ref, files, commits }, query)

        const cachedAnalysis = await this.cacheService.get(key)
        
        if (cachedAnalysis) return cachedAnalysis

        const analysis = await this.awsBedrockService.invokeModel(prompt)

        await this.cacheService.set(key, analysis)

        return analysis
    }

    private generatePrompt(prData: PRData, options?: AnalysisOptions): string {
        const activeOptions = this.getActiveOptions(options);
        const fileChanges = this.formatFileChanges(prData);
        const commitMessages = this.formatCommitMessages(prData);
        const analysisSections = this.formatAnalysisSections(activeOptions);

        return `
      You are a senior AI code reviewer. A developer has submitted the following Pull Request:
      
      🔹 **Title**: ${prData.title}  
      🔹 **Author**: ${prData.author}  
      🔹 **Source Branch**: ${prData.branch}  
      🔹 **Target Branch**: ${prData.base}  
      
      📝 **Description**:  
      ${prData.body}
      
      📄 **Files Changed**:  
      ${fileChanges}
      
      🧾 **Commits**:  
      ${commitMessages}
      
      ---
      
      Please produce a **comprehensive pull request review report** that includes the following sections:
      
      ${analysisSections}
      `;
    }

    private getActiveOptions(options?: AnalysisOptions): AnalysisOptions {
        const defaultOptions: AnalysisOptions = {
            summary: true,
            codeQuality: true,
            bugIssues: true,
            testCoverage: true,
            documentation: true,
            impactAnalysis: true,
            suggestionAndAlternatives: true,
        };
        return options ?? defaultOptions;
    }

    private formatFileChanges(prData: PRData): string {
        return prData.files
            .map(file => `- ${file.status.toUpperCase()}: ${file.filename}`)
            .join('\n');
    }

    private formatCommitMessages(prData: PRData): string {
        return prData.commits
            .map(commit => `- ${commit.commit.message}`)
            .join('\n');
    }

    private formatAnalysisSections(options: AnalysisOptions): string {
        const sectionMap: { [key in keyof AnalysisOptions]: string } = {
            summary: "1. **Summary of Changes**",
            codeQuality: "2. **Code Quality Assessment**",
            bugIssues: "3. **Potential Bugs or Issues**",
            testCoverage: "4. **Test Coverage Analysis**",
            documentation: "5. **Documentation Quality**",
            impactAnalysis: "6. **Impact Analysis**",
            suggestionAndAlternatives: "7. **Suggested Improvements or Alternatives**",
        };

        return Object.entries(options)
            .filter(([, enabled]) => enabled)
            .map(([key]) => sectionMap[key as keyof AnalysisOptions])
            .join('\n');
    }
}
