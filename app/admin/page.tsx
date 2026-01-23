"use client";

import { useFlaggedContent, useModerateContent } from "./page.hooks";
import { useFlaggedContentStore } from "./page.stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentStatus } from "./page.types";

export default function AdminPage() {
  const { filterStatus, setFilterStatus } = useFlaggedContentStore();
  const { data, isPending } = useFlaggedContent(filterStatus);
  const { mutate: moderateContent, isPending: isModerating } = useModerateContent();

  const handleModerate = (id: string, action: "approve" | "remove") => {
    moderateContent({ id, action });
  };

  return (
    <div>
      <div className="mb-6">
        <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as ContentStatus | "ALL")}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="FLAGGED">Flagged</TabsTrigger>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="REMOVED">Removed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No flagged content</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {(item as any).page?.title || "Unknown Page"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold">Reported by:</span>{" "}
                    {(item as any).reporter?.username || "Unknown"}
                  </div>
                  <div>
                    <span className="font-semibold">Page owner:</span>{" "}
                    {(item as any).page?.profile?.username || "Unknown"}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status === "FLAGGED"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Reported:</span>{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-1">Reason:</p>
                  <p className="text-sm text-gray-700">{item.reason}</p>
                </div>

                {item.ai_analysis && (
                  <div>
                    <p className="font-semibold text-sm mb-1">AI Analysis:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                      {JSON.stringify(item.ai_analysis, null, 2)}
                    </pre>
                  </div>
                )}

                {item.status === "FLAGGED" && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="default"
                      onClick={() => handleModerate(item.id, "approve")}
                      disabled={isModerating}
                      className="flex-1"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleModerate(item.id, "remove")}
                      disabled={isModerating}
                      className="flex-1"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
