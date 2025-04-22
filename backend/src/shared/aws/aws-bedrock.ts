import { Injectable } from '@nestjs/common';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { config } from '../../common/config/config';

@Injectable()
export class AwsBedrockService {
    private client: BedrockRuntimeClient;

    constructor() {
        this.client = new BedrockRuntimeClient({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.accessKey,
                secretAccessKey: config.aws.secretAccessKey
            },
        });
    }

    async invokeModel(prompt: string): Promise<string> {
        const modelId = config.aws.aiAgent;
        const baseParams = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 200,
            top_k: 250,
            temperature: 0.7,
            top_p: 0.95,
        };

        let messages = this.createMessagePrompt(prompt);
        let fullResponse = "";
        let shouldContinue = true;

        while (shouldContinue) {
            const response = await this.callBedrock(modelId, messages, baseParams);
            const textChunk = this.extractResponseText(response);
            const stopReason = response?.stop_reason;

            fullResponse += textChunk;

            if (stopReason === "max_tokens") {
                messages = this.buildContinuationMessages(prompt, fullResponse);
            } else {
                shouldContinue = false;
            }
        }

        return fullResponse.trim();
    }

    private createMessagePrompt(prompt: string) {
        return [
            {
                role: "user",
                content: [{ type: "text", text: prompt }],
            },
        ];
    }

    private buildContinuationMessages(originalPrompt: string, accumulatedResponse: string) {
        return [
            {
                role: "user",
                content: [{ type: "text", text: originalPrompt }],
            },
            {
                role: "assistant",
                content: [{ type: "text", text: accumulatedResponse }],
            },
        ];
    }

    private async callBedrock(modelId: string, messages: any[], params: any) {
        const input = {
            modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                ...params,
                messages,
            }),
        };

        const command = new InvokeModelCommand(input);
        const response = await this.client.send(command);
        return JSON.parse(new TextDecoder().decode(response.body));
    }

    private extractResponseText(response: any): string {
        return response?.content?.[0]?.text?.trim() ?? "";
    }
}