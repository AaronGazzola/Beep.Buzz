"use client";

import { useState } from "react";
import {
  useUserPages,
  useCreatePage,
  usePageElements,
  useContentElements,
  useElementManipulation,
  useDeleteElements,
} from "./page.hooks";
import { useContentElementsStore } from "./page.stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ElementType } from "./page.types";

export default function EditPage() {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newElementType, setNewElementType] = useState<ElementType>("TEXT");
  const [elementContent, setElementContent] = useState<any>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: pagesData, isPending: isPagesLoading } = useUserPages();
  const { mutate: createPage, isPending: isCreating } = useCreatePage();
  const { data: elements, isPending: isElementsLoading } = usePageElements(selectedPageId);
  const { mutate: addElement, isPending: isAdding } = useContentElements();
  const { mutate: deleteElement, isPending: isDeleting } = useDeleteElements();

  const { selectedElementId, setSelectedElementId } = useContentElementsStore();

  const handleCreatePage = () => {
    if (newPageTitle) {
      createPage(newPageTitle, {
        onSuccess: () => {
          setNewPageTitle("");
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleAddElement = () => {
    if (!selectedPageId) return;

    const content: any = {};
    const position = { x: 50, y: 50, width: 30, height: 20 };

    if (newElementType === "TEXT") {
      content.text = elementContent.text || "New Text";
      content.fontSize = elementContent.fontSize || "16px";
      content.color = elementContent.color || "#000000";
    } else if (newElementType === "SHAPE") {
      content.fillColor = elementContent.fillColor || "#000000";
      content.shape = elementContent.shape || "square";
    } else if (newElementType === "DIVIDER") {
      content.color = elementContent.color || "#000000";
    } else if (newElementType === "YOUTUBE") {
      content.videoId = elementContent.videoId || "";
    }

    addElement({
      page_id: selectedPageId,
      element_type: newElementType,
      content,
      position,
    });

    setElementContent({});
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Edit Your Pages</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New Page</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Page Title</Label>
                  <Input
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="My Awesome Page"
                  />
                </div>
                <Button onClick={handleCreatePage} disabled={isCreating || !newPageTitle} className="w-full">
                  {isCreating ? "Creating..." : "Create Page"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Pages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isPagesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))
                ) : pagesData?.pages.length === 0 ? (
                  <p className="text-sm text-gray-600">No pages yet</p>
                ) : (
                  pagesData?.pages.map((page) => (
                    <Button
                      key={page.id}
                      variant={selectedPageId === page.id ? "default" : "outline"}
                      onClick={() => setSelectedPageId(page.id)}
                      className="w-full justify-start truncate"
                    >
                      {page.title}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>

            {selectedPageId && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Add Element</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={newElementType} onValueChange={(v) => setNewElementType(v as ElementType)}>
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="TEXT">Text</TabsTrigger>
                      <TabsTrigger value="SHAPE">Shape</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-2 w-full mt-2">
                      <TabsTrigger value="DIVIDER">Divider</TabsTrigger>
                      <TabsTrigger value="YOUTUBE">Video</TabsTrigger>
                    </TabsList>

                    <TabsContent value="TEXT" className="space-y-3">
                      <Input
                        placeholder="Text content"
                        value={elementContent.text || ""}
                        onChange={(e) => setElementContent({ ...elementContent, text: e.target.value })}
                      />
                      <Input
                        type="color"
                        value={elementContent.color || "#000000"}
                        onChange={(e) => setElementContent({ ...elementContent, color: e.target.value })}
                      />
                    </TabsContent>

                    <TabsContent value="SHAPE" className="space-y-3">
                      <Input
                        type="color"
                        value={elementContent.fillColor || "#000000"}
                        onChange={(e) => setElementContent({ ...elementContent, fillColor: e.target.value })}
                      />
                      <select
                        value={elementContent.shape || "square"}
                        onChange={(e) => setElementContent({ ...elementContent, shape: e.target.value })}
                        className="w-full h-10 px-3 border rounded-md"
                      >
                        <option value="square">Square</option>
                        <option value="circle">Circle</option>
                      </select>
                    </TabsContent>

                    <TabsContent value="DIVIDER" className="space-y-3">
                      <Input
                        type="color"
                        value={elementContent.color || "#000000"}
                        onChange={(e) => setElementContent({ ...elementContent, color: e.target.value })}
                      />
                    </TabsContent>

                    <TabsContent value="YOUTUBE" className="space-y-3">
                      <Input
                        placeholder="YouTube Video ID"
                        value={elementContent.videoId || ""}
                        onChange={(e) => setElementContent({ ...elementContent, videoId: e.target.value })}
                      />
                    </TabsContent>
                  </Tabs>

                  <Button onClick={handleAddElement} disabled={isAdding} className="w-full">
                    {isAdding ? "Adding..." : "Add Element"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            {!selectedPageId ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">Select a page to edit</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Page Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-8 min-h-[400px] sm:min-h-[600px]">
                    {isElementsLoading ? (
                      <Skeleton className="h-full w-full" />
                    ) : (
                      elements?.map((element) => {
                        const pos = element.position as any;
                        const content = element.content as any;
                        const isSelected = selectedElementId === element.id;

                        return (
                          <div
                            key={element.id}
                            className={`absolute cursor-pointer ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                            style={{
                              left: `${pos.x}%`,
                              top: `${pos.y}%`,
                              width: pos.width ? `${pos.width}%` : "auto",
                              height: pos.height ? `${pos.height}%` : "auto",
                            }}
                            onClick={() => setSelectedElementId(element.id)}
                          >
                            {element.element_type === "TEXT" && (
                              <div
                                style={{
                                  fontSize: content.fontSize || "16px",
                                  color: content.color || "#000000",
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

                            {isSelected && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteElement({ id: element.id });
                                }}
                                disabled={isDeleting}
                              >
                                ×
                              </Button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
