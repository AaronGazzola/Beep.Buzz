import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ReactNode } from "react";

const mockMessages = [
  {
    id: "msg-1",
    sender_id: "user-1",
    recipient_id: "user-2",
    message: "hello",
    morse_code: ".... . .-.. .-.. ---",
    created_at: "2026-01-01T00:00:02Z",
    updated_at: null,
  },
  {
    id: "msg-2",
    sender_id: "user-2",
    recipient_id: "user-1",
    message: "hi",
    morse_code: ".... ..",
    created_at: "2026-01-01T00:00:01Z",
    updated_at: null,
  },
];

const mockGetDirectMessagesAction = vi.fn().mockResolvedValue(mockMessages);
const mockSendDirectMessageAction = vi.fn();

vi.mock("../page.actions", () => ({
  getDirectMessagesAction: (...args: unknown[]) => mockGetDirectMessagesAction(...args),
  sendDirectMessageAction: (...args: unknown[]) => mockSendDirectMessageAction(...args),
}));

let presenceCallbacks: Record<string, (payload: unknown) => void> = {};
let broadcastCallbacks: Record<string, (payload: unknown) => void> = {};
let postgresCallbacks: Record<string, (payload: unknown) => void> = {};
let subscribeCb: ((status: string) => void) | null = null;
let lastChannelName = "";

const mockChannel = {
  on: vi.fn((type: string, filter: Record<string, string>, cb: (payload: unknown) => void) => {
    if (type === "postgres_changes") {
      postgresCallbacks[filter.event] = cb;
    } else if (type === "presence") {
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
  untrack: vi.fn(),
  presenceState: vi.fn().mockReturnValue({}),
};

const mockRemoveChannel = vi.fn();

vi.mock("@/supabase/browser-client", () => ({
  supabase: {
    channel: vi.fn((name: string, _opts?: unknown) => {
      lastChannelName = name;
      presenceCallbacks = {};
      broadcastCallbacks = {};
      postgresCallbacks = {};
      subscribeCb = null;
      return mockChannel;
    }),
    removeChannel: (...args: unknown[]) => mockRemoveChannel(...args),
  },
}));

vi.mock("@/app/layout.stores", () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: "user-1" },
    isAuthenticated: true,
  })),
}));

import {
  useDirectMessages,
  useRealtimeDirectMessages,
  useSendDirectMessage,
  useMorseSignals,
} from "../page.hooks";

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

function createQueryClientWithData(partnerUserId: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(["directMessages", partnerUserId], {
    pages: [mockMessages],
    pageParams: [undefined],
  });
  return queryClient;
}

describe("useDirectMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDirectMessagesAction.mockResolvedValue(mockMessages);
  });

  it("calls getDirectMessagesAction with correct partnerUserId", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useDirectMessages("user-2"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetDirectMessagesAction).toHaveBeenCalledWith("user-2", undefined);
  });

  it("returns paginated data via useInfiniteQuery", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useDirectMessages("user-2"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0]).toEqual(mockMessages);
  });

  it("computes nextPageParam from last message created_at", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useDirectMessages("user-2"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });

  it("returns no next page when response is empty", async () => {
    mockGetDirectMessagesAction.mockResolvedValue([]);
    const wrapper = createWrapper();
    const { result } = renderHook(() => useDirectMessages("user-2"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });
});

describe("useRealtimeDirectMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("subscribes to the correct channel name with sorted IDs", () => {
    const queryClient = createQueryClientWithData("user-2");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useRealtimeDirectMessages("user-2"), { wrapper });

    expect(lastChannelName).toBe("direct-messages:user-1:user-2");
  });

  it("adds incoming INSERT message to query cache", async () => {
    const queryClient = createQueryClientWithData("user-2");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useRealtimeDirectMessages("user-2"), { wrapper });

    const newMsg = {
      id: "msg-3",
      sender_id: "user-2",
      recipient_id: "user-1",
      message: "new!",
      morse_code: "-. . .--",
      created_at: "2026-01-01T00:00:03Z",
      updated_at: null,
    };

    act(() => {
      postgresCallbacks["INSERT"]?.({ new: newMsg });
    });

    const data = queryClient.getQueryData<{ pages: typeof mockMessages[] }>(["directMessages", "user-2"]);
    expect(data?.pages[0]).toContainEqual(newMsg);
  });

  it("deduplicates messages by id", () => {
    const queryClient = createQueryClientWithData("user-2");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useRealtimeDirectMessages("user-2"), { wrapper });

    act(() => {
      postgresCallbacks["INSERT"]?.({ new: mockMessages[0] });
    });

    const data = queryClient.getQueryData<{ pages: typeof mockMessages[] }>(["directMessages", "user-2"]);
    const ids = data?.pages[0].map((m) => m.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids?.length).toBe(uniqueIds.length);
  });

  it("filters irrelevant messages (wrong sender/recipient)", () => {
    const queryClient = createQueryClientWithData("user-2");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useRealtimeDirectMessages("user-2"), { wrapper });

    const irrelevantMsg = {
      id: "msg-irrelevant",
      sender_id: "user-99",
      recipient_id: "user-88",
      message: "not for you",
      morse_code: "",
      created_at: "2026-01-01T00:00:05Z",
      updated_at: null,
    };

    act(() => {
      postgresCallbacks["INSERT"]?.({ new: irrelevantMsg });
    });

    const data = queryClient.getQueryData<{ pages: typeof mockMessages[] }>(["directMessages", "user-2"]);
    expect(data?.pages[0]).not.toContainEqual(irrelevantMsg);
  });

  it("unsubscribes on unmount", () => {
    const queryClient = createQueryClientWithData("user-2");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { unmount } = renderHook(() => useRealtimeDirectMessages("user-2"), { wrapper });
    unmount();

    expect(mockRemoveChannel).toHaveBeenCalledWith(mockChannel);
  });
});

describe("useSendDirectMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls sendDirectMessageAction with correct params", async () => {
    const newMsg = {
      id: "msg-new",
      sender_id: "user-1",
      recipient_id: "user-2",
      message: "test",
      morse_code: "-",
      created_at: "2026-01-01T00:00:10Z",
      updated_at: null,
    };
    mockSendDirectMessageAction.mockResolvedValue(newMsg);

    const queryClient = createQueryClientWithData("user-2");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useSendDirectMessage("user-2"), { wrapper });

    await act(async () => {
      result.current.mutate({
        recipientId: "user-2",
        message: "test",
        morseCode: "-",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSendDirectMessageAction).toHaveBeenCalledWith("user-2", "test", "-");
  });

  it("inserts message into query cache on success (sorted by created_at DESC)", async () => {
    const newMsg = {
      id: "msg-new",
      sender_id: "user-1",
      recipient_id: "user-2",
      message: "newest",
      morse_code: "-.",
      created_at: "2026-01-01T00:00:10Z",
      updated_at: null,
    };
    mockSendDirectMessageAction.mockResolvedValue(newMsg);

    const queryClient = createQueryClientWithData("user-2");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useSendDirectMessage("user-2"), { wrapper });

    await act(async () => {
      result.current.mutate({
        recipientId: "user-2",
        message: "newest",
        morseCode: "-.",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = queryClient.getQueryData<{ pages: typeof mockMessages[] }>(["directMessages", "user-2"]);
    expect(data?.pages[0][0].id).toBe("msg-new");
  });

  it("deduplicates by id on success", async () => {
    mockSendDirectMessageAction.mockResolvedValue(mockMessages[0]);

    const queryClient = createQueryClientWithData("user-2");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useSendDirectMessage("user-2"), { wrapper });

    await act(async () => {
      result.current.mutate({
        recipientId: "user-2",
        message: "hello",
        morseCode: ".... . .-.. .-.. ---",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = queryClient.getQueryData<{ pages: typeof mockMessages[] }>(["directMessages", "user-2"]);
    const ids = data?.pages[0].map((m) => m.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids?.length).toBe(uniqueIds.length);
  });
});

describe("useMorseSignals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("subscribes to broadcast channel with sorted IDs", () => {
    const wrapper = createWrapper();
    const onSignal = vi.fn();

    renderHook(() => useMorseSignals("user-2", onSignal), { wrapper });

    expect(lastChannelName).toBe("direct:user-1:user-2");
  });

  it("calls onSignal callback when signal is received", () => {
    const wrapper = createWrapper();
    const onSignal = vi.fn();

    renderHook(() => useMorseSignals("user-2", onSignal), { wrapper });

    act(() => {
      broadcastCallbacks["signal"]?.({
        payload: { signal: ".", userId: "user-2" },
      });
    });

    expect(onSignal).toHaveBeenCalledWith(".", "user-2");
  });

  it("broadcastSignal sends correct payload", () => {
    const wrapper = createWrapper();
    const onSignal = vi.fn();

    const { result } = renderHook(() => useMorseSignals("user-2", onSignal), { wrapper });

    act(() => {
      result.current.broadcastSignal("-");
    });

    expect(mockChannel.send).toHaveBeenCalledWith({
      type: "broadcast",
      event: "signal",
      payload: { userId: "user-1", signal: "-" },
    });
  });

  it("unsubscribes on unmount", () => {
    const wrapper = createWrapper();
    const onSignal = vi.fn();

    const { unmount } = renderHook(() => useMorseSignals("user-2", onSignal), { wrapper });
    unmount();

    expect(mockRemoveChannel).toHaveBeenCalledWith(mockChannel);
  });
});
