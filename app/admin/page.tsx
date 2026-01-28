"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useFlaggedContent,
  useUpdateFlagStatus,
  usePendingStickerDesigns,
  useUpdateStickerApproval,
  useModerationLogs,
  useRemoveContent,
} from "./page.hooks";
import { useAdminStore } from "./page.stores";
import { useCurrentUser } from "../layout.hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Home,
  Flag,
  Sticker,
  ScrollText,
  Check,
  X,
  Trash2,
} from "lucide-react";
import type { AdminTab } from "./page.types";
import type { FlagStatus, ApprovalStatus, ContentType } from "../layout.types";

export default function AdminPage() {
  const router = useRouter();
  const [removalReason, setRemovalReason] = useState("");

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const { data: flaggedContent, isLoading: isFlagsLoading } = useFlaggedContent();
  const { data: pendingDesigns, isLoading: isDesignsLoading } = usePendingStickerDesigns();
  const { data: moderationLogs, isLoading: isLogsLoading } = useModerationLogs();

  const updateFlagStatus = useUpdateFlagStatus();
  const updateStickerApproval = useUpdateStickerApproval();
  const removeContent = useRemoveContent();

  const { activeTab, setActiveTab } = useAdminStore();

  useEffect(() => {
    if (!isUserLoading && !currentUser?.user) {
      router.push("/sign-in");
    }
    if (!isUserLoading && currentUser?.profile?.role !== "admin") {
      router.push("/");
    }
  }, [isUserLoading, currentUser, router]);

  const handleFlagStatusUpdate = (flagId: string, status: FlagStatus) => {
    updateFlagStatus.mutate(
      { flagId, status },
      {
        onSuccess: () => {
          toast.success(`Flag ${status}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleStickerApproval = (designId: string, status: ApprovalStatus) => {
    updateStickerApproval.mutate(
      { designId, status },
      {
        onSuccess: () => {
          toast.success(`Sticker ${status}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRemoveContent = (
    contentType: ContentType,
    contentId: string,
    flagId: string
  ) => {
    if (!removalReason) return;

    removeContent.mutate(
      { contentType, contentId, reason: removalReason },
      {
        onSuccess: () => {
          toast.success("Content removed");
          setRemovalReason("");
          handleFlagStatusUpdate(flagId, "reviewed");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-[600px] w-full" />
        </main>
      </div>
    );
  }

  if (currentUser?.profile?.role !== "admin") {
    return null;
  }

  const pendingFlags = flaggedContent?.filter((f) => f.status === "pending") || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              Beep.Buzz
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Admin</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage flagged content, sticker approvals, and moderation logs
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="flags" className="flex items-center gap-2">
              <Flag className="size-4" />
              Flags
              {pendingFlags.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {pendingFlags.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stickers" className="flex items-center gap-2">
              <Sticker className="size-4" />
              Stickers
              {pendingDesigns && pendingDesigns.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {pendingDesigns.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <ScrollText className="size-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flags">
            {isFlagsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : flaggedContent && flaggedContent.length > 0 ? (
              <div className="space-y-4">
                {flaggedContent.map((flag) => (
                  <Card key={flag.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {flag.content_type} Report
                        </CardTitle>
                        <Badge
                          variant={
                            flag.status === "pending"
                              ? "destructive"
                              : flag.status === "reviewed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {flag.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Reporter:</span>{" "}
                            @{flag.reporter?.username || "Unknown"}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reason:</span>{" "}
                            {flag.reason}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Content ID:</span>{" "}
                            <code className="text-xs">{flag.content_id}</code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>{" "}
                            {new Date(flag.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {flag.details && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Details:</span>
                            <p className="mt-1">{flag.details}</p>
                          </div>
                        )}

                        {flag.status === "pending" && (
                          <div className="flex gap-2 pt-4 border-t border-border">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleFlagStatusUpdate(flag.id, "dismissed")}
                              disabled={updateFlagStatus.isPending}
                            >
                              <X className="size-4 mr-2" />
                              Dismiss
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleFlagStatusUpdate(flag.id, "reviewed")}
                              disabled={updateFlagStatus.isPending}
                            >
                              <Check className="size-4 mr-2" />
                              Resolve
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="size-4 mr-2" />
                                  Remove Content
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Remove Content</DialogTitle>
                                  <DialogDescription>
                                    This will permanently remove the flagged content.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Textarea
                                    placeholder="Reason for removal"
                                    value={removalReason}
                                    onChange={(e) => setRemovalReason(e.target.value)}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleRemoveContent(
                                        flag.content_type,
                                        flag.content_id,
                                        flag.id
                                      )
                                    }
                                    disabled={!removalReason || removeContent.isPending}
                                  >
                                    Remove Content
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Flag className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No flagged content</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stickers">
            {isDesignsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : pendingDesigns && pendingDesigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingDesigns.map((design) => {
                  const designData = design.design_data as Record<string, unknown>;
                  return (
                    <Card key={design.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{design.sticker_type} Sticker</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div
                            className="w-24 h-24 mx-auto rounded flex items-center justify-center text-4xl"
                            style={{
                              backgroundColor: (designData.color as string) || "#3b82f6",
                            }}
                          >
                            {(designData.emoji as string) || "?"}
                          </div>
                          <div className="text-sm text-center">
                            <span className="text-muted-foreground">By:</span>{" "}
                            @{design.profile?.username || "Unknown"}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleStickerApproval(design.id, "approved")}
                              disabled={updateStickerApproval.isPending}
                            >
                              <Check className="size-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleStickerApproval(design.id, "rejected")}
                              disabled={updateStickerApproval.isPending}
                            >
                              <X className="size-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Sticker className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending sticker designs</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs">
            {isLogsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : moderationLogs && moderationLogs.length > 0 ? (
              <div className="space-y-4">
                {moderationLogs.map((log) => (
                  <Card key={log.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                log.action === "remove"
                                  ? "destructive"
                                  : log.action === "warn"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {log.action}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {log.content_type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.reason}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>by @{log.admin?.username || "Unknown"}</div>
                          <div>{new Date(log.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <ScrollText className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No moderation logs</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
