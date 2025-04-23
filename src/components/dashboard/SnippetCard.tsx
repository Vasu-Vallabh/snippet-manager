import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CodeEditor } from "./CodeEditor";
import { Timestamp } from "firebase/firestore";
import { Copy, Edit, Share2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SnippetCardProps {
 snippet: {
    id: string;
    title: string;
    code: string;
    tags: string[];
    language: string;
    createdAt: Timestamp;
  };
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function SnippetCard({ snippet, onDelete, onEdit }: SnippetCardProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    toast({
      title: "Copied to clipboard",
      description: "The snippet has been copied to your clipboard",
    });
  };

  const handleEdit = () => {
    navigate(`/EditSnippet?snippet=${encodeURIComponent(JSON.stringify(snippet))}`);
  };

  const shareSnippet = () => {
    navigator.clipboard.writeText(window.location.origin + '/snippet/' + snippet.id);
    toast({
      title: "Link copied",
      description: "Share link has been copied to your clipboard",
    });
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-none">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">{snippet.title} 
                <span className="text-sm text-muted-foreground ml-2">Last updated {snippet.createdAt.toDate().toLocaleDateString()}</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                  {onEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleEdit}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit snippet</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={shareSnippet}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share snippet</p>
                    </TooltipContent>
                  </Tooltip>
                  <AlertDialog open={open} onOpenChange={setOpen}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete snippet</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this snippet? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpen(false)
                          }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(snippet.id)
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-800 rounded-md p-2">
          <CodeEditor
            code={snippet.code}
            language={snippet.language}
            maxHeight="200px"
          />
        </div>
        <div className="mt-4 flex gap-2">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline">{snippet.language}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
