"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser, useUserProfile } from "@/app/layout.hooks";
import {
  useUserPage,
  useCreatePage,
  useUpdatePageStatus,
  useContentBlocks,
  useUpdateContentBlock,
  useDeleteContentBlock,
  useElementDrag,
} from "./page.hooks";
import {
  useContentBlocksStore,
  useElementDragStore,
  useAddBlockDialogStore,
} from "./page.stores";
import type {
  ContentType,
  TextContent,
  ShapeContent,
  DividerContent,
  YoutubeContent,
  PageElement,
} from "./page.types";
import {
  Loader2,
  Plus,
  Type,
  Square,
  Minus,
  Youtube,
  GripVertical,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CONTENT_TYPES: { type: ContentType; label: string; icon: React.ReactNode }[] = [
  { type: "TEXT", label: "Text", icon: <Type className="h-4 w-4" /> },
  { type: "SHAPE", label: "Shape", icon: <Square className="h-4 w-4" /> },
  { type: "DIVIDER", label: "Divider", icon: <Minus className="h-4 w-4" /> },
  { type: "YOUTUBE", label: "YouTube", icon: <Youtube className="h-4 w-4" /> },
];

const SHAPE_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#ffeaa7",
  "#dfe6e9",
  "#fd79a8",
  "#a29bfe",
];

export default function StudioPage() {
  const router = useRouter();
  const { data: user, isPending: isUserLoading } = useCurrentUser();
  const { data: profile, isPending: isProfileLoading } = useUserProfile();
  const { data: pageData, isPending: isPageLoading } = useUserPage();
  const elements = useContentBlocksStore((state) => state.elements);
  const { isDragging, setDragging } = useElementDragStore();
  const { isOpen, selectedType, open, close, setSelectedType } =
    useAddBlockDialogStore();

  const createPage = useCreatePage();
  const updateStatus = useUpdatePageStatus();
  const addBlock = useContentBlocks();
  const updateBlock = useUpdateContentBlock();
  const deleteBlock = useDeleteContentBlock();
  const dragElement = useElementDrag();

  const [newPageTitle, setNewPageTitle] = useState("");
  const [blockContent, setBlockContent] = useState<
    TextContent | ShapeContent | DividerContent | YoutubeContent | null
  >(null);
  const [editingElement, setEditingElement] = useState<PageElement | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!isProfileLoading && profile && !profile.username) {
      router.push("/welcome");
    }
  }, [profile, isProfileLoading, router]);

  if (isUserLoading || isProfileLoading || isPageLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const page = pageData?.page;

  const handleCreatePage = () => {
    if (!newPageTitle.trim()) return;
    createPage.mutate(newPageTitle, {
      onSuccess: () => setNewPageTitle(""),
    });
  };

  const handleAddBlock = () => {
    if (!page || !selectedType || !blockContent) return;
    addBlock.mutate(
      { pageId: page.id, data: { type: selectedType, content: blockContent } },
      {
        onSuccess: () => {
          close();
          setBlockContent(null);
        },
      }
    );
  };

  const handleUpdateBlock = () => {
    if (!editingElement || !blockContent) return;
    updateBlock.mutate(
      { elementId: editingElement.id, content: blockContent },
      {
        onSuccess: () => {
          setEditingElement(null);
          setBlockContent(null);
        },
      }
    );
  };

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDragging(true, elementId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", elementId);
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("text/plain");
    dragElement.mutate({ elementId, newPosition: dropIndex });
    setDragging(false);
    setDragOverIndex(null);
  };

  const openAddDialog = (type: ContentType) => {
    setSelectedType(type);
    switch (type) {
      case "TEXT":
        setBlockContent({ text: "" });
        break;
      case "SHAPE":
        setBlockContent({ shape: "square", color: SHAPE_COLORS[0] });
        break;
      case "DIVIDER":
        setBlockContent({ style: "solid" });
        break;
      case "YOUTUBE":
        setBlockContent({ videoId: "" });
        break;
    }
    open(type);
  };

  const openEditDialog = (element: PageElement) => {
    setEditingElement(element);
    setBlockContent(element.content as typeof blockContent);
  };

  const renderBlockEditor = () => {
    if (!selectedType && !editingElement) return null;
    const type = selectedType || editingElement?.type;

    switch (type) {
      case "TEXT":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Text Content</Label>
              <Textarea
                value={(blockContent as TextContent)?.text || ""}
                onChange={(e) =>
                  setBlockContent({ ...(blockContent as TextContent), text: e.target.value })
                }
                placeholder="Enter your text..."
                rows={4}
              />
            </div>
          </div>
        );
      case "SHAPE":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Shape</Label>
              <Select
                value={(blockContent as ShapeContent)?.shape || "square"}
                onValueChange={(value) =>
                  setBlockContent({
                    ...(blockContent as ShapeContent),
                    shape: value as ShapeContent["shape"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="rectangle">Rectangle</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {SHAPE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setBlockContent({ ...(blockContent as ShapeContent), color })
                    }
                    className={cn(
                      "h-8 w-8 rounded border-2 transition-transform hover:scale-110",
                      (blockContent as ShapeContent)?.color === color
                        ? "border-primary scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case "DIVIDER":
        return (
          <div className="space-y-2">
            <Label>Style</Label>
            <Select
              value={(blockContent as DividerContent)?.style || "solid"}
              onValueChange={(value) =>
                setBlockContent({
                  ...(blockContent as DividerContent),
                  style: value as DividerContent["style"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "YOUTUBE":
        return (
          <div className="space-y-2">
            <Label>YouTube Video ID</Label>
            <Input
              value={(blockContent as YoutubeContent)?.videoId || ""}
              onChange={(e) =>
                setBlockContent({
                  ...(blockContent as YoutubeContent),
                  videoId: e.target.value,
                })
              }
              placeholder="e.g., dQw4w9WgXcQ"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderElement = (element: PageElement, index: number) => {
    const content = element.content as
      | TextContent
      | ShapeContent
      | DividerContent
      | YoutubeContent;

    return (
      <div
        key={element.id}
        draggable
        onDragStart={(e) => handleDragStart(e, element.id)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
        className={cn(
          "group relative bg-card border border-border rounded-lg p-4 transition-all",
          isDragging && "opacity-50",
          dragOverIndex === index && "border-primary border-2"
        )}
      >
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(element)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteBlock.mutate(element.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="pl-6">
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
                  ...(content as ShapeContent).shape === "triangle" && {
                    width: 0,
                    height: 0,
                    backgroundColor: "transparent",
                    borderLeft: "32px solid transparent",
                    borderRight: "32px solid transparent",
                    borderBottom: `64px solid ${(content as ShapeContent).color}`,
                  },
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
        </div>
      </div>
    );
  };

  if (!page) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create Your Page</CardTitle>
            <CardDescription>
              Give your page a title to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="My Awesome Page"
              />
            </div>
            <Button
              onClick={handleCreatePage}
              disabled={!newPageTitle.trim() || createPage.isPending}
              className="w-full"
            >
              {createPage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Page"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={page.status === "PUBLISHED" ? "default" : "secondary"}
          >
            {page.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateStatus.mutate({
                pageId: page.id,
                status: page.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
              })
            }
            disabled={updateStatus.isPending}
          >
            {page.status === "PUBLISHED" ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPES.map(({ type, label, icon }) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => openAddDialog(type)}
          >
            {icon}
            <span className="ml-2">{label}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {elements.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No content blocks yet. Add one above!
              </p>
            </CardContent>
          </Card>
        ) : (
          elements.map((element, index) => renderElement(element, index))
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add {CONTENT_TYPES.find((t) => t.type === selectedType)?.label} Block
            </DialogTitle>
            <DialogDescription>
              Configure your new content block
            </DialogDescription>
          </DialogHeader>
          {renderBlockEditor()}
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleAddBlock} disabled={addBlock.isPending}>
              {addBlock.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Block"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingElement}
        onOpenChange={(open) => !open && setEditingElement(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Block</DialogTitle>
            <DialogDescription>Update your content block</DialogDescription>
          </DialogHeader>
          {renderBlockEditor()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingElement(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBlock} disabled={updateBlock.isPending}>
              {updateBlock.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
