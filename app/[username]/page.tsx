"use client";

import { useParams } from "next/navigation";
import { useUserProfile, usePlaceStickers } from "./page.hooks";
import { usePlaceStickersStore } from "./page.stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const { data, isPending, error } = useUserProfile(username);
  const { mutate: placeSticker, isPending: isPlacing } = usePlaceStickers();
  const { placementMode, setPlacementMode, stickers } = usePlaceStickersStore();

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  if (error) {
    throw error;
  }

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageId: string) => {
    if (!placementMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    placeSticker({
      page_id: pageId,
      is_buzz: placementMode === "buzz",
      position: { x, y },
    });

    setPlacementMode(null);
  };

  const renderSticker = (sticker: any, profile: any) => {
    const style = sticker.is_buzz ? profile.buzz_style : profile.beep_style;
    const text = sticker.is_buzz ? "BUZZ" : "BEEP";

    return (
      <div
        key={sticker.id}
        className="absolute w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xs sm:text-sm font-bold pointer-events-none"
        style={{
          left: `${sticker.position.x}%`,
          top: `${sticker.position.y}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          color: style.textColor,
          borderWidth: "2px",
          borderStyle: "solid",
          borderRadius: style.shape === "circle" ? "50%" : style.shape === "rounded" ? "8px" : "0",
        }}
      >
        {text}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {isPending ? (
          <>
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{data?.profile.username}</h1>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={placementMode === "beep" ? "default" : "outline"}
                  onClick={() => setPlacementMode(placementMode === "beep" ? null : "beep")}
                  disabled={isPlacing}
                  size="sm"
                >
                  Place Beep
                </Button>
                <Button
                  variant={placementMode === "buzz" ? "default" : "outline"}
                  onClick={() => setPlacementMode(placementMode === "buzz" ? null : "buzz")}
                  disabled={isPlacing}
                  size="sm"
                >
                  Place Buzz
                </Button>
              </div>
              {placementMode && (
                <p className="text-sm text-gray-600 mt-2">
                  Click on a page to place your {placementMode} sticker
                </p>
              )}
            </div>

            {data?.pages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">No pages yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {data?.pages.map((page) => (
                  <Card key={page.id} className={placementMode ? "cursor-crosshair" : ""}>
                    <CardHeader>
                      <CardTitle>{page.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="relative bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-8 min-h-[300px] sm:min-h-[400px]"
                        onClick={(e) => handlePageClick(e, page.id)}
                      >
                        {page.elements.map((element) => {
                          const pos = element.position as any;
                          const content = element.content as any;

                          return (
                            <div
                              key={element.id}
                              className="absolute"
                              style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                width: pos.width ? `${pos.width}%` : "auto",
                                height: pos.height ? `${pos.height}%` : "auto",
                              }}
                            >
                              {element.element_type === "TEXT" && (
                                <div
                                  style={{
                                    fontSize: content.fontSize || "16px",
                                    color: content.color || "#000000",
                                    fontWeight: content.bold ? "bold" : "normal",
                                    fontStyle: content.italic ? "italic" : "normal",
                                  }}
                                >
                                  {content.text}
                                </div>
                              )}
                              {element.element_type === "SHAPE" && (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: content.fillColor || "#000000",
                                    borderRadius: content.shape === "circle" ? "50%" : "0",
                                  }}
                                />
                              )}
                              {element.element_type === "DIVIDER" && (
                                <hr style={{ borderColor: content.color || "#000000" }} />
                              )}
                              {element.element_type === "YOUTUBE" && (
                                <div className="aspect-video w-full">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${content.videoId}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {stickers
                          .filter((s) => s.page_id === page.id)
                          .map((sticker) => renderSticker(sticker, data.profile))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
