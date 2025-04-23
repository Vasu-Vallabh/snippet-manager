import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SnippetCard } from "./SnippetCard";
import { Timestamp } from "firebase/firestore";

interface Snippet {
  id: string;
  title: string;
  code: string;
  tags: string[];
  language: string;
  createdAt: Timestamp;
}

interface SnippetListProps {
  snippets: Snippet[];
  loading: boolean;
  onDeleteSnippet: (id: string) => void;
  onEditSnippet: (id: string) => void;
}

export function SnippetList({
  snippets,
  loading,
  onDeleteSnippet,
  onEditSnippet,
}: SnippetListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="w-full">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-[250px] mb-4" />
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No snippets found. Create your first snippet to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onDelete={onDeleteSnippet}
          onEdit={onEditSnippet}
        />
      ))}
    </div>
  );
}