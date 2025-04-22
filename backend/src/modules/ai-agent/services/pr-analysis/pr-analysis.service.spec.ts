import { Test, TestingModule } from '@nestjs/testing';
import { PrAnalysisService } from './pr-analysis.service';
import { HttpClientService } from '../../../http-client/http-client.service';
import { AwsBedrockService } from '../../../../shared/aws/aws-bedrock';
import { CacheService } from '../../../../shared/services/redis.service';
import { AnalyzePrDto, PrConfigDto } from '../../dto/analyze-pr.dto';
import { Helpers } from '../../../../shared/helpers/helper';
import AppError from '../../../../shared/helpers/app-error';

jest.mock('../../../../shared/helpers/helper');

describe('PrAnalysisService', () => {
    let service: PrAnalysisService;
    let httpClientService: HttpClientService;
    let awsBedrockService: AwsBedrockService;
    let cacheService: CacheService;

    const user = {
        githubAccessKey: 'fake-access-token'
    };

    const analyzeDto: AnalyzePrDto = {
        prUrl: 'https://github.com/testorg/testrepo/pull/42',
    };

    const prConfig: PrConfigDto = {
      summary: true,
      codeQuality: true,
      documentation: false,
      suggestionAndAlternatives: false,
      testCoverage: false,
      impactAnalysis: false,
      bugIssues: false
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrAnalysisService,
                {
                    provide: HttpClientService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: AwsBedrockService,
                    useValue: {
                        invokeBedrock: jest.fn(),
                    },
                },
                {
                    provide: CacheService,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PrAnalysisService>(PrAnalysisService);
        httpClientService = module.get<HttpClientService>(HttpClientService);
        awsBedrockService = module.get<AwsBedrockService>(AwsBedrockService);
        cacheService = module.get<CacheService>(CacheService);
    });

    it('should return cached result if present', async () => {
        (Helpers.parsePRUrl as jest.Mock).mockReturnValue({ owner: 'testorg', repo: 'testrepo', pull_number: '42' });
        (Helpers.getActiveAnalysisOptionsString as jest.Mock).mockReturnValue('all');

        cacheService.get = jest.fn().mockResolvedValue(JSON.stringify({ summary: 'cached result' }));

        const result = await service.analyzePullRequest(analyzeDto, prConfig, user as any);

        expect(result).toEqual({ summary: 'cached result' });
        expect(cacheService.get).toHaveBeenCalled();
    });

    it('should fetch from GitHub and return analysis if no cache', async () => {
        (Helpers.parsePRUrl as jest.Mock).mockReturnValue({ owner: 'testorg', repo: 'testrepo', pull_number: '42' });
        (Helpers.getActiveAnalysisOptionsString as jest.Mock).mockReturnValue('summarize_review');

        cacheService.get = jest.fn().mockResolvedValue(null);

        httpClientService.get = jest.fn()
            .mockResolvedValueOnce({ title: 'PR title' }) // PR
            .mockResolvedValueOnce([{ filename: 'file1.js' }]) // Files
            .mockResolvedValueOnce([{ commit: 'commit1' }]); // Commits

        awsBedrockService.invokeModel = jest.fn().mockResolvedValue('raw bedrock result');

        const result = await service.analyzePullRequest(analyzeDto, prConfig, user as any);

        expect(result).toEqual({ summary: 'bedrock result' });
        expect(cacheService.set).toHaveBeenCalled();
    });

    it('should throw if any GitHub API call fails', async () => {
        (Helpers.parsePRUrl as jest.Mock).mockReturnValue({ owner: 'testorg', repo: 'testrepo', pull_number: '42' });
        (Helpers.getActiveAnalysisOptionsString as jest.Mock).mockReturnValue('summarize_review');
        cacheService.get = jest.fn().mockResolvedValue(null);

        httpClientService.get = jest.fn()
            .mockResolvedValueOnce(null) // PR fails
            .mockResolvedValueOnce([{ filename: 'file1.js' }])
            .mockResolvedValueOnce([{ commit: 'commit1' }]);

        await expect(service.analyzePullRequest(analyzeDto, prConfig, user as any)).rejects.toThrow(AppError);
    });
});