"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useFlaggedContent,
  useContentModeration,
  useStickerApproval,
} from "./page.hooks";
import { useFlaggedContentStore } from "./page.stores";
import type { FlagStatus, StickerWithProfile } from "./page.types";
import {
  AlertTriangle,
  Check,
  X,
  Ban,
  Loader2,
  Sticker,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<FlagStatus, string> = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-500",
  REMOVED: "bg-red-500",
  DISMISSED: "bg-gray-500",
};

export default function AdminPage() {
  const { filter, setFilter } = useFlaggedContentStore();
  const { data: flaggedContent, isPending: isFlagsLoading } = useFlaggedContent(
    filter === "ALL" ? undefined : filter
  );
  const moderation = useContentModeration();
  const { stickers, approve } = useStickerApproval();

  const handleModerate = (flagId: string, action: "APPROVED" | "REMOVED" | "DISMISSED") => {
    moderation.mutate({ flagId, action });
  };

  const handleStickerApproval = (stickerId: string, approved: boolean) => {
    approve.mutate({ stickerId, approved });
  };

  const renderStickerPreview = (sticker: StickerWithProfile) => {
    const style = sticker.style as { size: string; color: string };
    const sizeClass =
      style.size === "small"
        ? "h-8 w-8 text-[10px]"
        : style.size === "large"
        ? "h-16 w-16 text-sm"
        : "h-12 w-12 text-xs";

    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-bold text-white",
          sizeClass
        )}
        style={{ backgroundColor: style.color }}
      >
        {sticker.type}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="flags" className="w-full">
        <TabsList>
          <TabsTrigger value="flags">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Flagged Content
          </TabsTrigger>
          <TabsTrigger value="stickers">
            <Sticker className="mr-2 h-4 w-4" />
            Stickers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flags" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Flagged Content</h2>
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as FlagStatus | "ALL")}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REMOVED">Removed</SelectItem>
                <SelectItem value="DISMISSED">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isFlagsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : flaggedContent && flaggedContent.length > 0 ? (
            <div className="space-y-4">
              {flaggedContent.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">
                          {item.content_type} Report
                        </CardTitle>
                        <CardDescription>
                          Reported by @{item.reporter?.username || "Unknown"}
                        </CardDescription>
                      </div>
                      <Badge
                        className={cn(
                          "text-white",
                          STATUS_COLORS[item.status]
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Reason:</p>
                      <p className="text-sm text-muted-foreground">
                        {item.reason}
                      </p>
                    </div>
                    {item.ai_analysis && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">AI Analysis:</p>
                        <p className="text-sm text-muted-foreground">
                          {JSON.stringify(item.ai_analysis)}
                        </p>
                      </div>
                    )}
                    {item.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleModerate(item.id, "APPROVED")}
                          disabled={moderation.isPending}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => handleModerate(item.id, "REMOVED")}
                          disabled={moderation.isPending}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleModerate(item.id, "DISMISSED")}
                          disabled={moderation.isPending}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No flagged content to review
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stickers" className="space-y-4">
          <h2 className="text-lg font-semibold">Sticker Designs</h2>

          {stickers.isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : stickers.data && stickers.data.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(stickers.data as StickerWithProfile[]).map((sticker) => (
                <Card key={sticker.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-center py-4">
                      {renderStickerPreview(sticker)}
                    </div>
                    <div className="text-center">
                      <p className="font-medium">@{sticker.profile?.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {sticker.type}
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStickerApproval(sticker.id, true)
                        }
                        disabled={approve.isPending}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Keep
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() =>
                          handleStickerApproval(sticker.id, false)
                        }
                        disabled={approve.isPending}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Sticker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No stickers to review</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
