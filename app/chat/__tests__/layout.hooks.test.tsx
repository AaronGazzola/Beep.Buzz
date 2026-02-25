import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";

let presenceCallbacks: Record<string, (payload?: unknown) => void> = {};
let broadcastCallbacks: Record<string, (payload: unknown) => void> = {};
let subscribeCb: ((status: string) => void) | null = null;
let presenceStateData: Record<string, unknown[]> = {};

const mockChannel = {
  on: vi.fn((type: string, filter: Record<string, string>, cb: (payload?: unknown) => void) => {
    if (type === "presence") {
      presenceCallbacks[filter.event] = cb;
    } else if (type === "broadcast") {
      broadcastCallbacks[filter.event] = cb;
    }
    return mockChannel;
  }),
  subscribe: vi.fn((cb?: (status: string) => void) => {
    if (cb) subscribeCb = cb;
    return mockChannel;
  }),
  send: vi.fn().mockResolvedValue("ok"),
  track: vi.fn().mockResolvedValue("ok"),
  untrack: vi.fn(),
  presenceState: vi.fn(() => presenceStateData),
};

const mockRemoveChannel = vi.fn();
let lastChannelName = "";

vi.mock("@/supabase/browser-client", () => ({
  supabase: {
    channel: vi.fn((name: string, _opts?: unknown) => {
      lastChannelName = name;
      presenceCallbacks = {};
      broadcastCallbacks = {};
      subscribeCb = null;
      return mockChannel;
    }),
    removeChannel: (...args: unknown[]) => mockRemoveChannel(...args),
  },
}));

const mockUseAuthStore = vi.fn(() => ({
  user: { id: "user-a" },
  isAuthenticated: true,
}));

vi.mock("@/app/layout.stores", () => ({
  useAuthStore: (...args: unknown[]) => mockUseAuthStore(...args),
}));

vi.mock("../layout.actions", () => ({
  getContactsAction: vi.fn().mockResolvedValue([]),
}));

import { useDirectMatchmaking } from "../layout.hooks";

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

describe("useDirectMatchmaking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    presenceStateData = {};
    mockUseAuthStore.mockReturnValue({
      user: { id: "user-a" },
      isAuthenticated: true,
    });
  });

  it("does not subscribe when disabled", () => {
    const wrapper = createWrapper();
    renderHook(() => useDirectMatchmaking({ enabled: false }), { wrapper });

    expect(mockChannel.subscribe).not.toHaveBeenCalled();
  });

  it("subscribes to matchmaking:queue and tracks presence when enabled", async () => {
    const wrapper = createWrapper();
    renderHook(() => useDirectMatchmaking({ enabled: true }), { wrapper });

    expect(lastChannelName).toBe("matchmaking:queue");
    expect(mockChannel.subscribe).toHaveBeenCalled();

    await act(async () => {
      subscribeCb?.("SUBSCRIBED");
    });

    expect(mockChannel.track).toHaveBeenCalledWith({ status: "searching" });
  });

  it("sets partnerUserId on presence sync with 2+ users", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useDirectMatchmaking({ enabled: true }), { wrapper });

    presenceStateData = {
      "user-a": [{ status: "searching" }],
      "user-b": [{ status: "searching" }],
    };

    act(() => {
      presenceCallbacks["sync"]?.();
    });

    await waitFor(() => expect(result.current.partnerUserId).toBe("user-b"));
  });

  it("sender (sorted ID first) broadcasts match_found", async () => {
    const wrapper = createWrapper();
    renderHook(() => useDirectMatchmaking({ enabled: true }), { wrapper });

    presenceStateData = {
      "user-a": [{ status: "searching" }],
      "user-b": [{ status: "searching" }],
    };

    act(() => {
      presenceCallbacks["sync"]?.();
    });

    expect(mockChannel.send).toHaveBeenCalledWith({
      type: "broadcast",
      event: "match_found",
      payload: { userId: "user-a", partnerId: "user-b" },
    });
  });

  it("receiver does not broadcast but sets partnerUserId from broadcast", async () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: "user-z" },
      isAuthenticated: true,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useDirectMatchmaking({ enabled: true }), { wrapper });

    act(() => {
      broadcastCallbacks["match_found"]?.({
        payload: { userId: "user-a", partnerId: "user-z" },
      });
    });

    await waitFor(() => expect(result.current.partnerUserId).toBe("user-a"));
  });

  it("cancel() resets partnerUserId to null", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useDirectMatchmaking({ enabled: true }), { wrapper });

    presenceStateData = {
      "user-a": [{ status: "searching" }],
      "user-b": [{ status: "searching" }],
    };

    act(() => {
      presenceCallbacks["sync"]?.();
    });

    await waitFor(() => expect(result.current.partnerUserId).toBe("user-b"));

    act(() => {
      result.current.cancel();
    });

    expect(result.current.partnerUserId).toBeNull();
  });

  it("cleans up: untrack + removeChannel on unmount", () => {
    const wrapper = createWrapper();
    const { unmount } = renderHook(() => useDirectMatchmaking({ enabled: true }), { wrapper });

    unmount();

    expect(mockChannel.untrack).toHaveBeenCalled();
    expect(mockRemoveChannel).toHaveBeenCalledWith(mockChannel);
  });
});
