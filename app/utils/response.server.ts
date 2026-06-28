import type { ApiSuccessResponse, ApiErrorResponse } from "../types";

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200,
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
  return Response.json(body, { status });
}

export function errorResponse(
  error: string,
  errors?: Record<string, string[]>,
  status = 400,
): Response {
  const body: ApiErrorResponse = {
    success: false,
    error,
    ...(errors ? { errors } : {}),
  };
  return Response.json(body, { status });
}

export function notFoundResponse(message = "Resource not found"): Response {
  return errorResponse(message, undefined, 404);
}

export function unauthorizedResponse(message = "Unauthorized"): Response {
  return errorResponse(message, undefined, 401);
}

export function methodNotAllowedResponse(): Response {
  return errorResponse("Method not allowed", undefined, 405);
}
