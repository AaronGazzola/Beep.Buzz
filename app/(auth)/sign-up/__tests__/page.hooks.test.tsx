import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";

const mockSignUp = vi.fn();
const mockPush = vi.fn();
const mockInvalidateQueries = vi.fn();
const mockCheckUsernameAvailableAction = vi.fn();

const mockUseGameStore = vi.fn(() => ({ learnedLetters: [] }));
(mockUseGameStore as unknown as { getState: () => unknown }).getState = vi.fn(() => ({
  learnedLetters: [],
}));

vi.mock("@/app/page.stores", () => ({
  useGameStore: Object.assign(
    (...args: unknown[]) => mockUseGameStore(...args),
    { getState: () => (mockUseGameStore as any).getState?.() },
  ),
}));

vi.mock("@/supabase/browser-client", () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../page.actions", () => ({
  checkUsernameAvailableAction: (...args: unknown[]) => mockCheckUsernameAvailableAction(...args),
}));

import { useEmailSignUp } from "../page.hooks";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.invalidateQueries = mockInvalidateQueries;
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useEmailSignUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignUp.mockResolvedValue({ data: { user: { id: "new-user" } }, error: null });
    (mockUseGameStore as unknown as { getState: () => unknown }).getState = vi.fn(() => ({
      learnedLetters: [],
    }));
  });

  it("passes pending_learned_letters from game store in sign-up metadata", async () => {
    const storedLetters = [{ letter: "S", practiceCount: 4 }, { letter: "E", practiceCount: 1 }];
    (mockUseGameStore as unknown as { getState: () => { learnedLetters: typeof storedLetters } }).getState = vi.fn(() => ({
      learnedLetters: storedLetters,
    }));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useEmailSignUp(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: "test@test.com", password: "password123", username: "tester" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSignUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@test.com",
        password: "password123",
        options: expect.objectContaining({
          data: expect.objectContaining({
            username: "tester",
            pending_learned_letters: storedLetters,
          }),
        }),
      })
    );
  });

  it("passes empty array when game store has no letters", async () => {
    (mockUseGameStore as unknown as { getState: () => { learnedLetters: never[] } }).getState = vi.fn(() => ({
      learnedLetters: [],
    }));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useEmailSignUp(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: "new@test.com", password: "password123", username: "newuser" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSignUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          data: expect.objectContaining({
            pending_learned_letters: [],
          }),
        }),
      })
    );
  });

  it("redirects to /verify on success", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useEmailSignUp(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: "test@test.com", password: "password123", username: "tester" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPush).toHaveBeenCalledWith("/verify");
  });

  it("throws when email is already registered", async () => {
    mockSignUp.mockResolvedValue({
      data: null,
      error: { message: "User already registered" },
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useEmailSignUp(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: "exists@test.com", password: "password123", username: "taken" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("An account with this email already exists");
  });
});
