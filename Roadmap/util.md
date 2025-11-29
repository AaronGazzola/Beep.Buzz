# File examples

This guide provides code examples and patterns for organizing your application code following best practices.

## Types file example

Type definitions establish contracts and ensure type safety throughout your application.

**Types file example (Client-side):**

```typescript
export interface AppState {
  data: any[];
  setData: (data: any[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export interface ApiData {
  id: string;
  name: string;
  value: number;
}
```

**Types file example (With Database):**

```typescript
import { User } from "@prisma/client";

export interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  tempEmail?: string;
  setTempEmail: (tempEmail: string) => void;
  reset: () => void;
}

export interface SignInData {
  email: string;
  password: string;
}
```

## Stores file example

Zustand stores manage application state with persistence and middleware support.

### Store Example (With Database)

```typescript
import { UserRole } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, ExtendedUser, RedirectState } from "./layout.types";

const initialState = {
  user: null,
};

export const useAppStore = create<AppState>()((set) => ({
  ...initialState,
  setUser: (user) => set({ user, profile: user?.profile || null }),
  reset: () => set(initialState),
}));
```

**Usage with React Query:**
```typescript
import { useAppStore } from "@/stores/app.stores";
import { useGetUser } from "@/hooks/user.hooks";

export const UserProfile = () => {
  const setUser = useAppStore((state) => state.setUser);
  const user = useAppStore((state) => state.user);

  const { isLoading } = useGetUser({
    onSuccess: (data) => setUser(data),
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>Welcome, {user?.name}</div>;
};
```

### Store Example (Without Database)

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "app-storage",
    }
  )
);
```

**Usage:**
```typescript
import { useAppStore } from "@/stores/app.stores";

export const ThemeToggle = () => {
  const { theme, setTheme } = useAppStore();

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Toggle Theme
    </button>
  );
};
```

## Actions file example

Server actions handle data mutations and communicate with your backend services.

**No actions file needed for client-side only applications.**

Use API routes or external API calls directly in hooks with React Query.

**Actions file example (NeonDB + Better Auth):**

```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth.utils";
import { User } from "@prisma/client";
import { headers } from "next/headers";

export const getUserAction = async (): Promise<ActionResponse<User | null>> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return getActionResponse();

    const { db } = await getAuthenticatedClient();

    const prismaUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    return getActionResponse({ data: prismaUser });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```

**Actions file example (Supabase + Better Auth):**

```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth.utils";
import { User } from "@prisma/client";
import { headers } from "next/headers";

export const getUserAction = async (): Promise<ActionResponse<User | null>> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return getActionResponse();

    const { db } = await getAuthenticatedClient();

    const prismaUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    return getActionResponse({ data: prismaUser });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```

**Actions file example (Supabase Auth Only):**

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse, getActionResponse } from "@/lib/action.utils";

export const getUserAction = async (): Promise<ActionResponse<any>> => {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return getActionResponse({ error: authError?.message || "Not authenticated" });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```

## Hooks file example

React Query hooks manage data fetching, caching, and synchronization.

**Hooks file example (Client-side):**

```typescript
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppStore } from "../layout.stores";

export const useGetData = () => {
  const { setData } = useAppStore();

  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const response = await fetch("/api/data");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setData(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateData = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (newData: any) => {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error("Failed to create");
      return response.json();
    },
    onSuccess: () => {
      router.refresh();
    },
  });
};
```

**Hooks file example (Better Auth):**

```typescript
"use client";

import { configuration, privatePaths } from "@/configuration";
import { signIn } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toast } from "../(components)/Toast";
import { CypressDataAttributes } from "../../types/cypress.types";
import { useAppStore, useRedirectStore } from "../layout.stores";
import { SignInData } from "../layout.types";
import { getUserAction } from "./layout.actions";
import { useAuthLayoutStore } from "./layout.stores";

export const useGetUser = () => {
  const { setUser, reset } = useAppStore();
  const { reset: resetAuthLayout } = useAuthLayoutStore();
  const { setUserData } = useRedirectStore();
  const pathname = usePathname();

  const router = useRouter();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await getUserAction();
      if (!data || error) {
        if (privatePaths.includes(pathname)) {
          router.push(configuration.paths.signIn);
        }
        reset();
        resetAuthLayout();
      }
      if (error) throw error;
      setUser(data ?? null);

      setUserData(data);

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSignIn = () => {
  const { setUser, setTempEmail } = useAppStore();
  const { setUserData } = useRedirectStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (signInData: SignInData) => {
      const { error } = await signIn.email({
        email: signInData.email,
        password: signInData.password,
      });

      if (error?.status === 403) setTempEmail(signInData.email);

      if (error) throw error;
      const { data: userData, error: userError } = await getUserAction();

      if (userError) throw new Error(userError);

      return userData;
    },
    onSuccess: (data) => {
      if (data) {
        setUser(data);
        setUserData(data);
      }
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Successfully signed in"
          data-cy={CypressDataAttributes.TOAST_SUCCESS}
        />
      ));
      if (data && !data.profile?.isOnboardingComplete) {
        router.push(configuration.paths.onboarding);
        return;
      }
      router.push(configuration.paths.home);
    },
    onError: (
      error: {
        code?: string | undefined;
        message?: string | undefined;
        status: number;
        statusText: string;
      } | null
    ) => {
      if (error?.status === 403) return;
      toast.custom(() => (
        <Toast
          variant="error"
          title="Sign In Failed"
          message={error?.message || "Failed to sign in"}
          data-cy={CypressDataAttributes.TOAST_ERROR}
        />
      ));
    },
  });
};
```

**Hooks file example (Supabase Auth):**

```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppStore } from "../layout.stores";

export const useGetUser = () => {
  const { setUser, reset } = useAppStore();
  const router = useRouter();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        reset();
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUser(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSignIn = () => {
  const { setUser } = useAppStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return data.user;
    },
    onSuccess: (user) => {
      setUser(user);
      router.push('/dashboard');
    },
  });
};
```

## Utility files

Utility modules provide reusable helper functions and configurations.

**No utility files needed for client-side only applications.**

**Utility files (Better Auth + Prisma):**

## `prisma-rls.ts`:

```typescript
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

function forUser(userId: string, tenantId?: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            if (tenantId) {
              const [, , result] = await prisma.$transaction([
                prisma.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, TRUE)`,
                prisma.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, TRUE)`,
                query(args),
              ]);
              return result;
            } else {
              const [, result] = await prisma.$transaction([
                prisma.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, TRUE)`,
                query(args),
              ]);
              return result;
            }
          },
        },
      },
    })
  );
}

export function createRLSClient(userId: string, tenantId?: string) {
  return prisma.$extends(forUser(userId, tenantId));
}
```

## `auth.util.ts`

```typescript
import { User } from "better-auth";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { auth, Session } from "./auth";
import { createRLSClient } from "./prisma-rls";

export async function getAuthenticatedClient(user?: User): Promise<{
  db: ReturnType<typeof createRLSClient>;
  session: Session | null;
}> {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  const userId = user?.id || session?.user.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const db = createRLSClient(userId);

  return { db, session };
}

export function generateSupabaseJWT(userId: string, userRole: string): string {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("SUPABASE_JWT_SECRET is required for JWT generation");
  }

  const payload = {
    aud: "authenticated",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    sub: userId,
    email: `${userId}@better-auth.local`,
    role: "authenticated",
    user_metadata: {
      better_auth_user_id: userId,
      better_auth_role: userRole,
    },
    app_metadata: {
      provider: "better-auth",
      providers: ["better-auth"],
    },
  };

  return jwt.sign(payload, jwtSecret, {
    algorithm: "HS256",
  });
}
```

## `log.util.ts`:

```typescript
export enum LOG_LABELS {
  GENERATE = "generate",
  API = "api",
  AUTH = "auth",
  DB = "db",
  FETCH = "fetch",
  RATE_LIMIT = "rate-limit",
  IMAGE = "image",
  WIDGET = "widget",
}

interface ConditionalLogOptions {
  maxStringLength?: number;
  label: LOG_LABELS | string;
}

export function conditionalLog(
  data: unknown,
  options: ConditionalLogOptions
): string | null {
  const { maxStringLength = 200, label } = options;

  const logLabels = process.env.NEXT_PUBLIC_LOG_LABELS;

  if (!logLabels || logLabels === "none") {
    return null;
  }

  if (logLabels !== "all") {
    const allowedLabels = logLabels.split(",").map((l) => l.trim());
    if (!allowedLabels.includes(label)) {
      return null;
    }
  }

  try {
    const processedData = deepStringify(data, maxStringLength, new WeakSet());
    const result = JSON.stringify(processedData);
    return result.replace(/\s+/g, "");
  } catch (error) {
    return JSON.stringify({ error: "Failed to stringify data", label });
  }
}

function deepStringify(
  value: unknown,
  maxLength: number,
  seen: WeakSet<object>
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return truncateString(value, maxLength);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: truncateString(value.message, maxLength),
      stack: value.stack ? truncateString(value.stack, maxLength) : undefined,
    };
  }

  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular Reference]";
    }

    seen.add(value);

    if (Array.isArray(value)) {
      const result = value.map((item) => deepStringify(item, maxLength, seen));
      seen.delete(value);
      return result;
    }

    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = deepStringify(val, maxLength, seen);
    }
    seen.delete(value);
    return result;
  }

  return String(value);
}

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  const startLength = Math.floor((maxLength - 3) / 2);
  const endLength = maxLength - 3 - startLength;

  return str.slice(0, startLength) + "..." + str.slice(-endLength);
}
```

**Utility files (Supabase):**

## `log.util.ts`:

```typescript
export enum LOG_LABELS {
  GENERATE = "generate",
  API = "api",
  AUTH = "auth",
  DB = "db",
  FETCH = "fetch",
  RATE_LIMIT = "rate-limit",
  IMAGE = "image",
  WIDGET = "widget",
}

interface ConditionalLogOptions {
  maxStringLength?: number;
  label: LOG_LABELS | string;
}

export function conditionalLog(
  data: unknown,
  options: ConditionalLogOptions
): string | null {
  const { maxStringLength = 200, label } = options;

  const logLabels = process.env.NEXT_PUBLIC_LOG_LABELS;

  if (!logLabels || logLabels === "none") {
    return null;
  }

  if (logLabels !== "all") {
    const allowedLabels = logLabels.split(",").map((l) => l.trim());
    if (!allowedLabels.includes(label)) {
      return null;
    }
  }

  try {
    const processedData = deepStringify(data, maxStringLength, new WeakSet());
    const result = JSON.stringify(processedData);
    return result.replace(/\s+/g, "");
  } catch (error) {
    return JSON.stringify({ error: "Failed to stringify data", label });
  }
}

function deepStringify(
  value: unknown,
  maxLength: number,
  seen: WeakSet<object>
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return truncateString(value, maxLength);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: truncateString(value.message, maxLength),
      stack: value.stack ? truncateString(value.stack, maxLength) : undefined,
    };
  }

  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular Reference]";
    }

    seen.add(value);

    if (Array.isArray(value)) {
      const result = value.map((item) => deepStringify(item, maxLength, seen));
      seen.delete(value);
      return result;
    }

    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = deepStringify(val, maxLength, seen);
    }
    seen.delete(value);
    return result;
  }

  return String(value);
}

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  const startLength = Math.floor((maxLength - 3) / 2);
  const endLength = maxLength - 3 - startLength;

  return str.slice(0, startLength) + "..." + str.slice(-endLength);
}
```
