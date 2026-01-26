"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/app/layout.hooks";
import {
  useProfilePage,
  useUserSticker,
  useStickerPlacement,
} from "./page.hooks";
import {
  useStickerPlacementStore,
  useStickerVisibilityStore,
} from "./page.stores";
import type {
  PageElementWithPlacements,
  StickerPlacementWithSticker,
} from "./page.types";
import { Sticker, Eye, EyeOff, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TextContent = { text: string };
type ShapeContent = { shape: string; color: string };
type DividerContent = { style: string; color?: string };
type YoutubeContent = { videoId: string };

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { data: pageData, isPending, isError } = useProfilePage(username);
  const { data: userSticker } = useUserSticker();

  const { showStickers, toggleStickers } = useStickerVisibilityStore();
  const { placingSticker, setPlacingSticker, selectedElementId, setSelectedElementId } =
    useStickerPlacementStore();

  const placeSticker = useStickerPlacement();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  if (isPending) {
    return (
      <div className="container py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !pageData?.profile) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">User not found</p>
            <Button variant="link" onClick={() => router.push("/")}>
              Go back home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { profile, page } = pageData;

  if (!page) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">@{profile.username}</h1>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                This user hasn&apos;t published a page yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleElementClick = (
    e: React.MouseEvent<HTMLDivElement>,
    elementId: string
  ) => {
    if (!placingSticker || !userSticker) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    placeSticker.mutate(
      {
        stickerId: userSticker.id,
        pageElementId: elementId,
        positionX: x,
        positionY: y,
      },
      {
        onSuccess: () => {
          setPlacingSticker(false);
          setSelectedElementId(null);
        },
      }
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingSticker) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const renderSticker = (
    placement: StickerPlacementWithSticker,
    elementRect?: DOMRect
  ) => {
    const style = placement.sticker.style as {
      size: string;
      color: string;
    };
    const sizeClass =
      style.size === "small"
        ? "h-6 w-6 text-[8px]"
        : style.size === "large"
        ? "h-10 w-10 text-xs"
        : "h-8 w-8 text-[10px]";

    return (
      <div
        key={placement.id}
        className={cn(
          "absolute flex items-center justify-center rounded-full font-bold text-white pointer-events-none transition-opacity",
          sizeClass,
          !showStickers && "opacity-0"
        )}
        style={{
          backgroundColor: style.color,
          left: `${placement.position_x}%`,
          top: `${placement.position_y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {placement.sticker.type}
      </div>
    );
  };

  const renderElement = (element: PageElementWithPlacements, index: number) => {
    const content = element.content as
      | TextContent
      | ShapeContent
      | DividerContent
      | YoutubeContent;
    const placements = element.sticker_placements || [];

    return (
      <div
        key={element.id}
        className={cn(
          "relative bg-card border border-border rounded-lg p-4 transition-all",
          placingSticker && "cursor-crosshair hover:border-primary"
        )}
        onClick={(e) => handleElementClick(e, element.id)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => placingSticker && setSelectedElementId(element.id)}
        onMouseLeave={() => placingSticker && setSelectedElementId(null)}
      >
        {element.type === "TEXT" && (
          <p className="whitespace-pre-wrap">{(content as TextContent).text}</p>
        )}
        {element.type === "SHAPE" && (
          <div className="flex justify-center py-4">
            <div
              className={cn(
                "w-16 h-16",
                (content as ShapeContent).shape === "circle" && "rounded-full",
                (content as ShapeContent).shape === "square" && "rounded",
                (content as ShapeContent).shape === "rectangle" && "w-24 h-12 rounded"
              )}
              style={{
                backgroundColor: (content as ShapeContent).color,
                ...((content as ShapeContent).shape === "triangle" && {
                  width: 0,
                  height: 0,
                  backgroundColor: "transparent",
                  borderLeft: "32px solid transparent",
                  borderRight: "32px solid transparent",
                  borderBottom: `64px solid ${(content as ShapeContent).color}`,
                }),
              }}
            />
          </div>
        )}
        {element.type === "DIVIDER" && (
          <hr
            className="my-4"
            style={{
              borderStyle: (content as DividerContent).style,
              borderColor: (content as DividerContent).color || undefined,
            }}
          />
        )}
        {element.type === "YOUTUBE" && (
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded"
              src={`https://www.youtube.com/embed/${(content as YoutubeContent).videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {placements.map((placement) => renderSticker(placement))}
        {placingSticker &&
          selectedElementId === element.id &&
          userSticker && (
            <div
              className="absolute flex items-center justify-center rounded-full font-bold text-white pointer-events-none opacity-50"
              style={{
                backgroundColor: (
                  userSticker.style as { color: string }
                ).color,
                width:
                  (userSticker.style as { size: string }).size === "small"
                    ? "24px"
                    : (userSticker.style as { size: string }).size === "large"
                    ? "40px"
                    : "32px",
                height:
                  (userSticker.style as { size: string }).size === "small"
                    ? "24px"
                    : (userSticker.style as { size: string }).size === "large"
                    ? "40px"
                    : "32px",
                left: mousePosition.x,
                top: mousePosition.y,
                transform: "translate(-50%, -50%)",
                fontSize:
                  (userSticker.style as { size: string }).size === "small"
                    ? "8px"
                    : (userSticker.style as { size: string }).size === "large"
                    ? "12px"
                    : "10px",
              }}
            >
              {userSticker.type}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="show-stickers"
              checked={showStickers}
              onCheckedChange={toggleStickers}
            />
            <Label htmlFor="show-stickers" className="flex items-center gap-1">
              {showStickers ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              Stickers
            </Label>
          </div>
          {currentUser && userSticker && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={placingSticker ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlacingSticker(!placingSticker)}
                  >
                    {placingSticker ? (
                      <>
                        <MousePointer2 className="mr-2 h-4 w-4" />
                        Click to place
                      </>
                    ) : (
                      <>
                        <Sticker className="mr-2 h-4 w-4" />
                        Place Sticker
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {placingSticker
                    ? "Click on a content block to place your sticker"
                    : "Leave your mark on this page"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {(page.page_elements as PageElementWithPlacements[]).map(
          (element, index) => renderElement(element, index)
        )}
      </div>
    </div>
  );
}
