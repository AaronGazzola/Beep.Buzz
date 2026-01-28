"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFeaturedPages, useSearchPages, useRandomPage, useCategories } from "./page.hooks";
import { useCurrentUser } from "./layout.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Shuffle, LogIn, Edit, Settings, Shield } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const { data: featuredPages, isLoading: isPagesLoading } = useFeaturedPages();
  const { data: categories } = useCategories();
  const { data: searchResults, isLoading: isSearchLoading } = useSearchPages(
    isSearching ? searchQuery : "",
    isSearching ? selectedCategory : undefined
  );
  const randomPageMutation = useRandomPage();

  const handleSearch = () => {
    if (searchQuery || selectedCategory) {
      setIsSearching(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setIsSearching(false);
  };

  const handleRandomPage = async () => {
    const page = await randomPageMutation.mutateAsync();
    if (page) {
      router.push(`/${page.profiles.username}`);
    }
  };

  const displayPages = isSearching ? searchResults : featuredPages;
  const isLoadingPages = isSearching ? isSearchLoading : isPagesLoading;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Beep.Buzz
          </Link>
          <nav className="flex items-center gap-2">
            {isUserLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : currentUser?.user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/editor">
                    <Edit className="size-4 mr-2" />
                    Editor
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="size-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                {currentUser.profile?.role !== "user" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin">
                      <Shield className="size-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/${currentUser.profile?.username || ""}`}>
                    My Page
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/sign-in">
                  <LogIn className="size-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Personal Pages
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore unique pages created by our community. Leave a Beep or Buzz
            to show your appreciation!
          </p>
        </section>

        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
          {isSearching && (
            <div className="flex justify-center mt-4">
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                Clear search
              </Button>
            </div>
          )}
        </section>

        <section className="mb-8 flex justify-center">
          <Button
            variant="outline"
            onClick={handleRandomPage}
            disabled={randomPageMutation.isPending}
          >
            <Shuffle className="size-4 mr-2" />
            {randomPageMutation.isPending ? "Finding..." : "Random Page"}
          </Button>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">
            {isSearching ? "Search Results" : "Featured Pages"}
          </h2>

          {isLoadingPages ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayPages && displayPages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.profiles.username}`}
                  className="block"
                >
                  <Card className="h-full hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{page.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        by @{page.profiles.username}
                      </p>
                      {page.meta_description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {page.meta_description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {isSearching
                  ? "No pages found matching your search."
                  : "No pages yet. Be the first to create one!"}
              </p>
              {!isSearching && currentUser?.user && (
                <Button className="mt-4" asChild>
                  <Link href="/editor">Create Your Page</Link>
                </Button>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Beep.Buzz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
