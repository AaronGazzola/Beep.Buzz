import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";

const mockSetUser = vi.fn();
const mockSetProfile = vi.fn();
const mockSetLearnedLetters = vi.fn();
const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockSignOut = vi.fn();
const mockGetLearnedLettersAction = vi.fn();
const mockSaveLearnedLettersAction = vi.fn();
const mockGetCurrentProfileAction = vi.fn();

let mockIsAuthenticated = true;
let mockUserId = "user-1";
let mockLearnedLetters = [{ letter: "A", practiceCount: 2 }];

const mockUseAuthStore = vi.fn(() => ({
  user: { id: mockUserId },
  isAuthenticated: mockIsAuthenticated,
  setUser: mockSetUser,
  setProfile: mockSetProfile,
  setLoading: vi.fn(),
}));

const mockUseGameStore = vi.fn((selector?: unknown) => {
  const state = {
    learnedLetters: mockLearnedLetters,
    setLearnedLetters: mockSetLearnedLetters,
  };
  if (typeof selector === "function") return (selector as (s: typeof state) => unknown)(state);
  return state;
});

(mockUseGameStore as unknown as { getState: () => unknown }).getState = vi.fn(() => ({
  learnedLetters: mockLearnedLetters,
  setLearnedLetters: mockSetLearnedLetters,
}));

vi.mock("@/app/layout.stores", () => ({
  useAuthStore: (...args: unknown[]) => mockUseAuthStore(...args),
}));

vi.mock("@/app/page.stores", () => ({
  useGameStore: Object.assign(
    (...args: unknown[]) => mockUseGameStore(...args),
    { getState: () => (mockUseGameStore as any).getState?.() },
  ),
}));

vi.mock("@/app/layout.actions", () => ({
  getCurrentProfileAction: (...args: unknown[]) => mockGetCurrentProfileAction(...args),
}));

vi.mock("@/app/page.actions", () => ({
  getLearnedLettersAction: (...args: unknown[]) => mockGetLearnedLettersAction(...args),
  saveLearnedLettersAction: (...args: unknown[]) => mockSaveLearnedLettersAction(...args),
}));

vi.mock("@/supabase/browser-client", () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null }),
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

import { useSignOut, useLearnedLetters, useLearnedLettersSync } from "../layout.hooks";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useSignOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOut.mockResolvedValue({ error: null });
    mockIsAuthenticated = true;
    mockUserId = "user-1";
  });

  it("calls supabase.auth.signOut on mutate", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSignOut(), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSignOut).toHaveBeenCalled();
  });

  it("clears learnedLetters from game store on success", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSignOut(), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSetLearnedLetters).toHaveBeenCalledWith([]);
  });

  it("clears auth store on success", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSignOut(), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockSetProfile).toHaveBeenCalledWith(null);
  });

  it("navigates to / on success", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSignOut(), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("throws when signOut returns an error", async () => {
    mockSignOut.mockResolvedValue({ error: new Error("sign out failed") });
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSignOut(), { wrapper });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockSetLearnedLetters).not.toHaveBeenCalled();
  });
});

describe("useLearnedLetters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = true;
    mockUserId = "user-1";
  });

  it("calls setLearnedLetters with DB data on success", async () => {
    const dbLetters = [{ letter: "B", practiceCount: 3 }];
    mockGetLearnedLettersAction.mockResolvedValue(dbLetters);

    const wrapper = createWrapper();
    renderHook(() => useLearnedLetters(), { wrapper });

    await waitFor(() => expect(mockGetLearnedLettersAction).toHaveBeenCalled());
    expect(mockSetLearnedLetters).toHaveBeenCalledWith(dbLetters);
  });

  it("calls setLearnedLetters with empty array when DB returns no letters", async () => {
    mockGetLearnedLettersAction.mockResolvedValue([]);

    const wrapper = createWrapper();
    renderHook(() => useLearnedLetters(), { wrapper });

    await waitFor(() => expect(mockGetLearnedLettersAction).toHaveBeenCalled());
    expect(mockSetLearnedLetters).toHaveBeenCalledWith([]);
  });

  it("does not fetch when not authenticated", () => {
    mockIsAuthenticated = false;
    mockUseAuthStore.mockReturnValue({
      user: null as unknown as { id: string },
      isAuthenticated: false,
      setUser: mockSetUser,
      setProfile: mockSetProfile,
      setLoading: vi.fn(),
    });

    const wrapper = createWrapper();
    renderHook(() => useLearnedLetters(), { wrapper });

    expect(mockGetLearnedLettersAction).not.toHaveBeenCalled();
    expect(mockSetLearnedLetters).not.toHaveBeenCalled();
  });

  it("returns isPending true while loading", () => {
    mockGetLearnedLettersAction.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useLearnedLetters(), { wrapper });

    expect(result.current.isPending).toBe(true);
  });
});

describe("useLearnedLettersSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = true;
    mockUserId = "user-1";
    mockLearnedLetters = [{ letter: "A", practiceCount: 2 }];
    mockUseAuthStore.mockReturnValue({
      user: { id: "user-1" },
      isAuthenticated: true,
      setUser: mockSetUser,
      setProfile: mockSetProfile,
      setLoading: vi.fn(),
    });
    mockSaveLearnedLettersAction.mockResolvedValue({ success: true });
  });

  it("saves letters to DB when authenticated and letters are present", async () => {
    mockUseGameStore.mockImplementation((selector?: unknown) => {
      const state = { learnedLetters: [{ letter: "A", practiceCount: 2 }], setLearnedLetters: mockSetLearnedLetters };
      if (typeof selector === "function") return (selector as (s: typeof state) => unknown)(state);
      return state;
    });

    const wrapper = createWrapper();
    renderHook(() => useLearnedLettersSync(), { wrapper });

    await waitFor(() => expect(mockSaveLearnedLettersAction).toHaveBeenCalledWith([{ letter: "A", practiceCount: 2 }]));
  });

  it("does not save when not authenticated", async () => {
    mockUseAuthStore.mockReturnValue({
      user: null as unknown as { id: string },
      isAuthenticated: false,
      setUser: mockSetUser,
      setProfile: mockSetProfile,
      setLoading: vi.fn(),
    });

    const wrapper = createWrapper();
    renderHook(() => useLearnedLettersSync(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(mockSaveLearnedLettersAction).not.toHaveBeenCalled();
  });

  it("does not save when letters array is empty", async () => {
    mockUseGameStore.mockImplementation((selector?: unknown) => {
      const state = { learnedLetters: [], setLearnedLetters: mockSetLearnedLetters };
      if (typeof selector === "function") return (selector as (s: typeof state) => unknown)(state);
      return state;
    });

    const wrapper = createWrapper();
    renderHook(() => useLearnedLettersSync(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(mockSaveLearnedLettersAction).not.toHaveBeenCalled();
  });
});
