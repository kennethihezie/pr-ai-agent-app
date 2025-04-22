import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class AnalyzePrDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/github\.com\/(.+?)\/(.+?)\/pull\/(\d+)/)
    prUrl: string
}

export class PrConfigDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    summary: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    codeQuality: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    bugIssues: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    testCoverage: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    documentation: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    impactAnalysis: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    suggestionAndAlternatives: boolean
}