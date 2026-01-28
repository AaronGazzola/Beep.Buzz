"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditorPage, useSavePage, useUpdatePageVisibility } from "./page.hooks";
import { useEditorStore } from "./page.stores";
import { useCurrentUser } from "../layout.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Home,
  Eye,
  EyeOff,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Square,
  Minus,
  Youtube,
  Settings,
  ExternalLink,
} from "lucide-react";
import type { ElementType } from "../layout.types";

export default function EditorPage() {
  const router = useRouter();
  const [pageTitle, setPageTitle] = useState("");

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const { isLoading: isPageLoading } = useEditorPage();
  const savePage = useSavePage();
  const updateVisibility = useUpdatePageVisibility();

  const {
    page,
    draftElements,
    selectedElementId,
    isPreview,
    hasUnsavedChanges,
    addElement,
    updateElement,
    removeElement,
    moveElement,
    selectElement,
    togglePreview,
  } = useEditorStore();

  useEffect(() => {
    if (!isUserLoading && !currentUser?.user) {
      router.push("/sign-in");
    }
    if (!isUserLoading && currentUser?.user && !currentUser.profile) {
      router.push("/welcome");
    }
  }, [isUserLoading, currentUser, router]);

  useEffect(() => {
    if (page?.title && !pageTitle) {
      setPageTitle(page.title);
    }
  }, [page?.title, pageTitle]);

  const handleSave = () => {
    if (!page) return;

    savePage.mutate(
      {
        pageId: page.id,
        title: pageTitle || "My Page",
        elements: draftElements,
      },
      {
        onSuccess: () => {
          toast.success("Page saved!");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleVisibilityChange = (visibility: "public" | "private") => {
    if (!page) return;

    updateVisibility.mutate(
      { pageId: page.id, visibility },
      {
        onSuccess: () => {
          toast.success(`Page is now ${visibility}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleAddElement = (type: ElementType) => {
    addElement(type);
  };

  const selectedElement = draftElements.find((el) => el.id === selectedElementId);

  const renderElement = (element: (typeof draftElements)[0]) => {
    const isSelected = element.id === selectedElementId;

    switch (element.element_type) {
      case "text":
        return (
          <div
            style={{
              fontSize: (element.properties.fontSize as number) || 16,
              color: (element.properties.color as string) || "inherit",
            }}
          >
            {element.content.text as string}
          </div>
        );
      case "shape":
        const shapeType = element.content.shape as string;
        const width = (element.properties.width as number) || 100;
        const height = (element.properties.height as number) || 100;
        const fill = (element.properties.fill as string) || "#3b82f6";
        return (
          <div
            style={{
              width,
              height,
              backgroundColor: fill,
              borderRadius: shapeType === "circle" ? "50%" : 0,
            }}
          />
        );
      case "divider":
        return <hr className="border-border my-4" />;
      case "youtube":
        const videoId = element.content.videoId as string;
        return videoId ? (
          <div className="aspect-video max-w-lg">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video max-w-lg bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Enter a YouTube video ID</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (isUserLoading || isPageLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              Beep.Buzz
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Editor</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePreview}
            >
              {isPreview ? (
                <>
                  <EyeOff className="size-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="size-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={savePage.isPending || !hasUnsavedChanges}
            >
              <Save className="size-4 mr-2" />
              {savePage.isPending ? "Saving..." : "Save"}
            </Button>
            {currentUser?.profile && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${currentUser.profile.username}`}>
                  <ExternalLink className="size-4 mr-2" />
                  View Page
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex">
        {!isPreview && (
          <aside className="w-64 border-r border-border min-h-[calc(100vh-65px)] p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pageTitle">Page Title</Label>
                <Input
                  id="pageTitle"
                  value={pageTitle}
                  onChange={(e) => {
                    setPageTitle(e.target.value);
                    useEditorStore.setState({ hasUnsavedChanges: true });
                  }}
                  placeholder="My Page"
                />
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={page?.visibility || "public"}
                  onValueChange={(value) =>
                    handleVisibilityChange(value as "public" | "private")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Add Elements</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddElement("text")}
                    className="flex-col h-16"
                  >
                    <Type className="size-4 mb-1" />
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddElement("shape")}
                    className="flex-col h-16"
                  >
                    <Square className="size-4 mb-1" />
                    Shape
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddElement("divider")}
                    className="flex-col h-16"
                  >
                    <Minus className="size-4 mb-1" />
                    Divider
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddElement("youtube")}
                    className="flex-col h-16"
                  >
                    <Youtube className="size-4 mb-1" />
                    YouTube
                  </Button>
                </div>
              </div>

              {selectedElement && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Settings className="size-4 mr-2" />
                      Edit Element
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit {selectedElement.element_type}</SheetTitle>
                      <SheetDescription>
                        Customize the selected element
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {selectedElement.element_type === "text" && (
                        <>
                          <div className="space-y-2">
                            <Label>Text</Label>
                            <Textarea
                              value={selectedElement.content.text as string}
                              onChange={(e) =>
                                updateElement(selectedElement.id, {
                                  content: { ...selectedElement.content, text: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Font Size</Label>
                            <Input
                              type="number"
                              value={selectedElement.properties.fontSize as number}
                              onChange={(e) =>
                                updateElement(selectedElement.id, {
                                  properties: {
                                    ...selectedElement.properties,
                                    fontSize: parseInt(e.target.value) || 16,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Color</Label>
                            <Input
                              type="color"
                              value={selectedElement.properties.color as string}
                              onChange={(e) =>
                                updateElement(selectedElement.id, {
                                  properties: {
                                    ...selectedElement.properties,
                                    color: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </>
                      )}
                      {selectedElement.element_type === "shape" && (
                        <>
                          <div className="space-y-2">
                            <Label>Shape</Label>
                            <Select
                              value={selectedElement.content.shape as string}
                              onValueChange={(value) =>
                                updateElement(selectedElement.id, {
                                  content: { ...selectedElement.content, shape: value },
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rectangle">Rectangle</SelectItem>
                                <SelectItem value="circle">Circle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>Width</Label>
                              <Input
                                type="number"
                                value={selectedElement.properties.width as number}
                                onChange={(e) =>
                                  updateElement(selectedElement.id, {
                                    properties: {
                                      ...selectedElement.properties,
                                      width: parseInt(e.target.value) || 100,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Height</Label>
                              <Input
                                type="number"
                                value={selectedElement.properties.height as number}
                                onChange={(e) =>
                                  updateElement(selectedElement.id, {
                                    properties: {
                                      ...selectedElement.properties,
                                      height: parseInt(e.target.value) || 100,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Fill Color</Label>
                            <Input
                              type="color"
                              value={selectedElement.properties.fill as string}
                              onChange={(e) =>
                                updateElement(selectedElement.id, {
                                  properties: {
                                    ...selectedElement.properties,
                                    fill: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </>
                      )}
                      {selectedElement.element_type === "youtube" && (
                        <div className="space-y-2">
                          <Label>Video ID</Label>
                          <Input
                            placeholder="dQw4w9WgXcQ"
                            value={selectedElement.content.videoId as string}
                            onChange={(e) =>
                              updateElement(selectedElement.id, {
                                content: { ...selectedElement.content, videoId: e.target.value },
                              })
                            }
                          />
                          <p className="text-sm text-muted-foreground">
                            Enter the video ID from the YouTube URL
                          </p>
                        </div>
                      )}
                      <div className="pt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveElement(selectedElement.id, "up")}
                          disabled={selectedElement.position === 0}
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveElement(selectedElement.id, "down")}
                          disabled={selectedElement.position === draftElements.length - 1}
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeElement(selectedElement.id)}
                          className="ml-auto"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </aside>
        )}

        <main className={`flex-1 p-8 ${isPreview ? "" : "max-w-4xl"}`}>
          <Card className="min-h-[600px]">
            <CardContent className="pt-6 space-y-4">
              {draftElements.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Your page is empty. Add some elements to get started!</p>
                </div>
              ) : (
                draftElements
                  .sort((a, b) => a.position - b.position)
                  .map((element) => (
                    <div
                      key={element.id}
                      className={`p-2 cursor-pointer transition-colors ${
                        !isPreview && element.id === selectedElementId
                          ? "ring-2 ring-primary ring-offset-2"
                          : !isPreview
                          ? "hover:bg-muted/50"
                          : ""
                      }`}
                      onClick={() => !isPreview && selectElement(element.id)}
                    >
                      {renderElement(element)}
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
