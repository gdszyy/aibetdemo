// Type inference utilities

/** Promise入参类型 */
export type PromiseType<T extends Promise<unknown>> = T extends Promise<infer U> ? U : never;

/** Interface request param type */
export type InterfaceRequest<T> = T extends (...args: infer Args) => Promise<unknown> ? Args[0] : never;

/** Interface response type */
export type InterfaceResponse<T extends (...args: any) => Promise<unknown>> = PromiseType<ReturnType<T>>;

/** 关联模型数据 */
export type Relation<T> = {
    relation: T;
};

/** Scroll pagination request params */
export type ScrollPageRequest<T = unknown> = {
    // Scroll pagination cursor
    cursor: number | string | null;
    // Items per page
    limit: number;
} & T;

/** Scroll pagination response */
export interface ScrollPageResponse<T> {
    // Data list
    list: T[];
    // Scroll pagination cursor for the next request
    next_cursor: number | string | null;
}

export interface PageResponse<T> {
    list: T[];
    total: number;
    page: number;
    page_size: number;
}

/** API error response structure */
export interface ErrorReject extends Error {
    /** Response code */
    code: number;
    /** Error message */
    message: string;
}
