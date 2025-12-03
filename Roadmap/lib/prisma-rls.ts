export type RLSOperation = "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL";

export interface RLSPolicy {
  operation: RLSOperation;
  role: string;
  using: string;
}

export const CreatorProfileRLS = {
  policies: [
    {
      operation: "SELECT",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "SELECT",
      role: "admin",
      using: `true`
    },
    {
      operation: "SELECT",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "INSERT",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "INSERT",
      role: "admin",
      using: `true`
    },
    {
      operation: "INSERT",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "UPDATE",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "UPDATE",
      role: "admin",
      using: `true`
    },
    {
      operation: "UPDATE",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "DELETE",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "DELETE",
      role: "admin",
      using: `true`
    },
    {
      operation: "DELETE",
      role: "super-admin",
      using: `true`
    }
  ],
};

export const PageComponentRLS = {
  policies: [
    {
      operation: "SELECT",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "SELECT",
      role: "admin",
      using: `true`
    },
    {
      operation: "SELECT",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "INSERT",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "INSERT",
      role: "admin",
      using: `true`
    },
    {
      operation: "INSERT",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "UPDATE",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "UPDATE",
      role: "admin",
      using: `true`
    },
    {
      operation: "UPDATE",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "DELETE",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "DELETE",
      role: "admin",
      using: `true`
    },
    {
      operation: "DELETE",
      role: "super-admin",
      using: `true`
    }
  ],
};

export const DonationRLS = {
  policies: [
    {
      operation: "SELECT",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "SELECT",
      role: "admin",
      using: `true`
    },
    {
      operation: "SELECT",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "INSERT",
      role: "user",
      using: `true`
    },
    {
      operation: "INSERT",
      role: "admin",
      using: `true`
    },
    {
      operation: "INSERT",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "UPDATE",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "UPDATE",
      role: "admin",
      using: `true`
    },
    {
      operation: "UPDATE",
      role: "super-admin",
      using: `true`
    },
    {
      operation: "DELETE",
      role: "user",
      using: `true`
    },
    {
      operation: "DELETE",
      role: "admin",
      using: `true`
    },
    {
      operation: "DELETE",
      role: "super-admin",
      using: `true`
    }
  ],
};