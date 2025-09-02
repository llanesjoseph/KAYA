import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\p{L}0-9_]+/gu) || [];
  // Normalize to lower-case id form while keeping display variant for storage handled elsewhere
  return Array.from(new Set(matches.map(t => t.replace(/^#/, '').trim())));
}
