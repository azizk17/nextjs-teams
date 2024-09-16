import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from "nanoid";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nanoId(length: number) {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', length);
  return nanoid();
}