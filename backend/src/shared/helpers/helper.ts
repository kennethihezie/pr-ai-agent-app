import { ErrorCode } from "../enums/error-codes.enum";
import { AnalysisOptions } from "../interfaces/analysis-option.interface";
import AppError from "./app-error";

export class Helpers {
  static parsePRUrl(url: string): { owner: string; repo: string; pull_number: number } {
    const match = url.match(/github\.com\/(.+?)\/(.+?)\/pull\/(\d+)/);

    if (!match) throw new AppError(ErrorCode['0002'], "'Invalid GitHub PR URL'");

    return { owner: match[1], repo: match[2], pull_number: parseInt(match[3], 10) };
  }

  static getActiveAnalysisOptionsString(options?: AnalysisOptions): string {
    const allKeys: (keyof AnalysisOptions)[] = [
      'summary',
      'codeQuality',
      'bugIssues',
      'testCoverage',
      'documentation',
      'impactAnalysis',
      'suggestionAndAlternatives'
    ]

    if (!options) return 'all';

    const activeKeys = allKeys.filter((key) => options[key]);

    if (activeKeys.length === 0 || activeKeys.length === allKeys.length) return 'all';
    if (activeKeys.length === 1) return activeKeys[0];

    return activeKeys.join('_');
  }
}