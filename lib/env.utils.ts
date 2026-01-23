export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
} as const;

export function getBrowserAPI<T>(getAPI: () => T): T | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    return getAPI();
  } catch {
    return undefined;
  }
}
