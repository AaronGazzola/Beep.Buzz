export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  SUPABASE_PROJECT_REF: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF!,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY!,
} as const;

export function getBrowserAPI<T>(getter: () => T): T | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    return getter();
  } catch {
    return undefined;
  }
}
