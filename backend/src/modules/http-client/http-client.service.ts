import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpClientMethods } from "../../shared/enums/http-client-methods.enum";

@Injectable()
export class HttpClientService {
    async get<O>(endpoint: string, headers?: Record<string, string>): Promise<O> {
        const response: AxiosResponse<O> | null = await this.sendRequest<null, O>(
            HttpClientMethods.GET,
            endpoint,
            null,
            headers,
        );
        return response.data;
    }

    async post<I, O>(
        endpoint: string,
        data: I,
        headers?: Record<string, string>,
    ): Promise<O> {
        const response: AxiosResponse<O> | null = await this.sendRequest<I, O>(
            HttpClientMethods.POST,
            endpoint,
            data,
            headers,
        );
   
        return response.data;
    }

    async patch<I, O>(
        endpoint: string,
        data: I,
        headers?: Record<string, string>,
    ): Promise<O> {
        const response: AxiosResponse<O> | null = await this.sendRequest<I, O>(
            HttpClientMethods.PATCH,
            endpoint,
            data,
            headers,
        );
        return response.data;
    }

    async put<I, O>(
        endpoint: string,
        data: I,
        headers?: Record<string, string>,
    ): Promise<O> {
        const response: AxiosResponse<O> | null = await this.sendRequest<I, O>(
            HttpClientMethods.PUT,
            endpoint,
            data,
            headers,
        );
        return response.data;
    }

    private async sendRequest<I, O>(
        method: HttpClientMethods,
        url: string,
        data: I,
        requestHeaders?: Record<string, string>,
    ) {
        const headers = this.buildHeaders(requestHeaders)
        const requestOptions: AxiosRequestConfig = {
            method,
            url,
            headers,
        };

        if (method !== HttpClientMethods.GET && data) {
            requestOptions.data = data;
        }

        try {
            const response = await axios.request<O>(requestOptions);
            return response;
        } catch (error) {
            console.error(`Error occurred in ${method} request to ${url}:`, error);
            return error.response;
        }
    }

    private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            ...customHeaders,
        };
    }
}