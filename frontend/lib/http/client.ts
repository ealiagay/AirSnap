import type { HttpMethod, RequestOptions } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(
    path.startsWith("http")
      ? path
      : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
  );
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
}

export async function request<
  TResponse = unknown,
  TBody = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>
>(options: RequestOptions<TBody, TParams>): Promise<TResponse> {
  const { path, method, params, body } = options;
  const url = buildUrl(path, params);

  const init: RequestInit = { method };

  // Sin headers. Body se envía tal cual (o JSON.stringify si es un objeto plano).
  if (body !== undefined) {
    if (
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      typeof body === "string" ||
      body instanceof Blob ||
      body instanceof ArrayBuffer
    ) {
      init.body = body as BodyInit;
    } else {
      init.body = JSON.stringify(body as any);
    }
  }

  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const err: any = new Error(`HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data as TResponse;
}

function toPath(pathOrUrl: string) {
  return pathOrUrl;
}

export const http = {
  request,
  get<T = unknown, P extends Record<string, unknown> = Record<string, unknown>>(
    path: string,
    params?: P
  ) {
    return request<T, never, P>({ path: toPath(path), method: "GET", params });
  },
  post<
    T = unknown,
    B = unknown,
    P extends Record<string, unknown> = Record<string, unknown>
  >(path: string, body?: B, params?: P) {
    return request<T, B, P>({
      path: toPath(path),
      method: "POST",
      body,
      params,
    });
  },
  put<
    T = unknown,
    B = unknown,
    P extends Record<string, unknown> = Record<string, unknown>
  >(path: string, body?: B, params?: P) {
    return request<T, B, P>({
      path: toPath(path),
      method: "PUT",
      body,
      params,
    });
  },
  patch<
    T = unknown,
    B = unknown,
    P extends Record<string, unknown> = Record<string, unknown>
  >(path: string, body?: B, params?: P) {
    return request<T, B, P>({
      path: toPath(path),
      method: "PATCH",
      body,
      params,
    });
  },
  del<T = unknown, P extends Record<string, unknown> = Record<string, unknown>>(
    path: string,
    params?: P
  ) {
    return request<T, never, P>({
      path: toPath(path),
      method: "DELETE",
      params,
    });
  },
};
