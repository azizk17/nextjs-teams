declare global {
}

export type Pagination = { page: number, limit?: number };



export type ActionResponse<T = any> = {
    success: boolean;
    message?: string;
    data?: T;
    status?: number;
    errors?: Record<string, string[] | string>;
}