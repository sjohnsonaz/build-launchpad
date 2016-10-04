export interface IConnection {
    base: string;
    status(response: Response): Promise<Response | void>;
    json<V>(response: Response): Promise<V>;
    call<T>(url: string | Request, init: RequestInit, success: (data: T) => any, error: (data: Error) => any): any;
}
