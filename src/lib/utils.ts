import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from "nanoid";
import { BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError, ValidationError } from "@/lib/errors";
import { ZodError } from "zod";
import { ActionResponse } from "@/types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nanoId(length: number) {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', length);
  return nanoid();
}
// okRes function for success
// This function is used to return a success response for an action
// -------------------------------------------------------------------------------------------------
export function okRes(message: string): ActionResponse {
  return {
    success: true,
    status: 200,
    message,
  };
}

export function errorResponse(status: number, message: string, errors?: Record<string, string | string[]>): ActionResponse {
  return {
    success: false,
    status,
    message,
    errors,
  };
}

export function successResponse(message: string, data?: any): ActionResponse {
  return {
    success: true,
    status: 200,
    message,
    data,
  };
}
// noRes function for error
// This function is used to return an error response for an action
// -------------------------------------------------------------------------------------------------
export function noRes(error: unknown): ActionResponse {
  console.error(error);
  if (error instanceof ZodError) {
    return {
      success: false,
      status: 422,
      message: "Invalid input",
      errors: error.flatten().fieldErrors as Record<string, string | string[]>,
    };
  }
  if (error instanceof NotFoundError) {
    return {
      success: false,
      status: 404,
      message: error.message,
    };
  }
  if (error instanceof BadRequestError) {
    return {
      success: false,
      status: 400,
      message: error.message,
    };
  }
  if (error instanceof UnauthorizedError) {
    return {
      success: false,
      status: 401,
      message: error.message,
    };
  }
  if (error instanceof ForbiddenError) {
    return {
      success: false,
      status: 403,
      message: error.message,
    };
  }
  if (error instanceof ValidationError) {
    return {
      success: false,
      status: 422,
      message: error.message,
    };
  }
  if (error instanceof InternalServerError) {
    return {
      success: false,
      status: 500,
      message: error.message,
    };
  }
  if (error instanceof ConflictError) {
    return {
      success: false,
      status: 409,
      message: error.message,
    };
  }
  if (error instanceof Error) {
    return {
      success: false,
      status: 500,
      message: error.message,
    };
  }
  return {
    success: false,
    status: 500,
    message: "An unexpected error occurred",
  };
}