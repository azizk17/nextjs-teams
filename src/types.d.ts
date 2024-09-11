export type ActionResult<T = any> = {
    success: boolean;
    message?: string;
    data?: T;
    status?: number;
    errors?: Record<string, string[] | string>;
}