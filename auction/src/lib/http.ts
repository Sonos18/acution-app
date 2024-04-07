import envConfig from "@/config";
import { SignInResSchemaType } from "@/schemaValidations/auth.schema";
import { normalizePath } from "./utils";
import { use } from "react";
import { useRefreshToken } from "./hooks/use-refresh-token";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

class Token {
  private accessToken = "";
  private refreshToken = "";
  get refresh() {
    return this.refreshToken;
  }
  set refresh(refreshToken: string) {
    if (typeof window === "undefined")
      throw new Error("Cannot set accessToken in server side");
    this.refreshToken = refreshToken;
  }
  get value() {
    return this.accessToken;
  }
  set value(accessToken: string) {
    if (typeof window === "undefined")
      throw new Error("Cannot set accessToken in server side");
    this.accessToken = accessToken;
  }
}

export const accessToken = new Token();

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const token = await useRefreshToken(accessToken.value, accessToken.refresh);
  console.log(token);
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: accessToken.value ? `Bearer ${accessToken.value}` : "",
  };
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_URL
      : options?.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else throw new HttpError(data);
  }
  if (typeof window !== "undefined") {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      const res = payload as SignInResSchemaType;
      accessToken.value = res.access_token;
      accessToken.refresh = res.refresh_token;
    } else if ("auth/logout" === normalizePath(url)) {
      accessToken.value = "";
      accessToken.refresh = "";
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
