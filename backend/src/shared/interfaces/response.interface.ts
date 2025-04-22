export interface AppResponse<T> {
    statusCode: number
    status: string
    message: string
    data: T
}