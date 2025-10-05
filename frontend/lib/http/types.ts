export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions<
  TBody = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>
> = {
  path: string;
  method: HttpMethod;
  params?: TParams;
  body?: TBody;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];
