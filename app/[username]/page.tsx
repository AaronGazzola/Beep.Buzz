"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useProfilePageData, useAddSticker, useRemoveSticker } from "./page.hooks";
import { useCurrentUser } from "../layout.hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Home, Edit, ArrowLeft, Zap, Volume2 } from "lucide-react";
import type { PageElement } from "../layout.types";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [selectedSticker, setSelectedSticker] = useState<"beep" | "buzz" | null>(null);

  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useProfilePageData(username);
  const addSticker = useAddSticker();
  const removeSticker = useRemoveSticker();

  const isOwner = currentUser?.user?.id === data?.profile?.user_id;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedSticker || !data?.page || !currentUser?.user) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    addSticker.mutate(
      {
        pageId: data.page.id,
        stickerType: selectedSticker,
        positionX: x,
        positionY: y,
      },
      {
        onSuccess: () => {
          toast.success(`${selectedSticker === "beep" ? "Beep" : "Buzz"} added!`);
          setSelectedSticker(null);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRemoveSticker = (stickerId: string) => {
    removeSticker.mutate(stickerId, {
      onSuccess: () => {
        toast.success("Sticker removed");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-9 w-20" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full max-w-4xl mx-auto" />
        </main>
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-2">User not found</h1>
            <p className="text-muted-foreground mb-4">
              The user @{username} does not exist.
            </p>
            <Button asChild>
              <Link href="/">
                <Home className="size-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderElement = (element: PageElement) => {
    const content = element.content as Record<string, unknown>;
    const properties = element.properties as Record<string, unknown>;

    switch (element.element_type) {
      case "text":
        return (
          <div
            key={element.id}
            style={{
              fontSize: (properties.fontSize as number) || 16,
              color: (properties.color as string) || "inherit",
            }}
          >
            {content.text as string}
          </div>
        );
      case "shape":
        const shapeType = content.shape as string;
        const width = (properties.width as number) || 50;
        const height = (properties.height as number) || 50;
        const fill = (properties.fill as string) || "#000000";
        return (
          <div
            key={element.id}
            style={{
              width,
              height,
              backgroundColor: fill,
              borderRadius: shapeType === "circle" ? "50%" : 0,
            }}
          />
        );
      case "divider":
        return <hr key={element.id} className="border-border my-4" />;
      case "youtube":
        const videoId = content.videoId as string;
        return videoId ? (
          <div key={element.id} className="aspect-video max-w-lg">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">@{data.profile.username}</h1>
              {data.page && (
                <p className="text-sm text-muted-foreground">{data.page.title}</p>
              )}
            </div>
          </div>
          <nav className="flex items-center gap-2">
            {isOwner && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/editor">
                  <Edit className="size-4 mr-2" />
                  Edit
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!data.page ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                @{data.profile.username} hasn&apos;t created a page yet.
              </p>
              {isOwner && (
                <Button asChild>
                  <Link href="/editor">Create Your Page</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {currentUser?.user && !isOwner && (
              <div className="mb-6 flex items-center justify-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedSticker === "beep" ? "default" : "outline"}
                        onClick={() =>
                          setSelectedSticker(selectedSticker === "beep" ? null : "beep")
                        }
                      >
                        <Volume2 className="size-4 mr-2" />
                        Beep
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Click to add a Beep sticker, then click on the page
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedSticker === "buzz" ? "default" : "outline"}
                        onClick={() =>
                          setSelectedSticker(selectedSticker === "buzz" ? null : "buzz")
                        }
                      >
                        <Zap className="size-4 mr-2" />
                        Buzz
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Click to add a Buzz sticker, then click on the page
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            {selectedSticker && (
              <p className="text-center text-sm text-muted-foreground mb-4">
                Click anywhere on the page to place your{" "}
                {selectedSticker === "beep" ? "Beep" : "Buzz"}!
              </p>
            )}

            <Card
              className={`relative min-h-[400px] cursor-${
                selectedSticker ? "crosshair" : "default"
              }`}
              onClick={handleCanvasClick}
            >
              <CardContent className="pt-6 space-y-4">
                {data.page.page_elements
                  .sort((a, b) => a.position - b.position)
                  .map(renderElement)}

                {data.page.stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="absolute group"
                    style={{
                      left: sticker.position_x,
                      top: sticker.position_y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center ${
                        sticker.sticker_type === "beep"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {sticker.sticker_type === "beep" ? (
                        <Volume2 className="size-4" />
                      ) : (
                        <Zap className="size-4" />
                      )}
                    </div>
                    {sticker.user_id === currentUser?.user?.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSticker(sticker.id);
                        }}
                        className="absolute -top-1 -right-1 size-4 rounded-full bg-destructive text-destructive-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {data.page.stickers.length} sticker
              {data.page.stickers.length !== 1 ? "s" : ""} on this page
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
