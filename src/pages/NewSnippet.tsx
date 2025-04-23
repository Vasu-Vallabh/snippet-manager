import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Code, Tag, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "@/components/dashboard/CodeEditor";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { useSearchParams } from "react-router-dom";

const snippetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  code: z.string().min(1, "Code is required"),
  language: z.string().min(1, "Language is required"),
  tags: z.array(z.string()).optional(),
  saveLocally: z.boolean().optional(),
});

const supportedLanguages = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "java",
  "cpp",
  "css",
  "html",
  "sql",
  "json",
  "markdown",
];

type SnippetFormData = z.infer<typeof snippetSchema>;

interface NewSnippetProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function NewSnippet({ onCancel, onSuccess }: NewSnippetProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to create snippets",
        });
        onCancel();
      }
    });
    return () => unsubscribe();
  }, [onCancel]);

  const form = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: "",
      code: "",
      language: "javascript",
      saveLocally: false,
    },
  });

  useEffect(() => {
    const snippetParam = searchParams.get("snippet");
    if (snippetParam) {
      try {
        const decodedSnippet = JSON.parse(decodeURIComponent(snippetParam));
        form.setValue("title", decodedSnippet.title);
        form.setValue("code", decodedSnippet.code);
        form.setValue("language", decodedSnippet.language);
        setTags(decodedSnippet.tags || []);
      } catch (error) {
        console.error("Error parsing snippet:", error);
        toast({
          title: "Error",
          description: "Failed to load snippet data",
          variant: "destructive",
        });
      }
    }
  }, [searchParams, form, toast]);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        e.currentTarget.value = "";
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: SnippetFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create snippets",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const snippetData = {
        ...data,
        tags,
        userId: user.uid,
        createdAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, "snippets"), snippetData);
      
      if (docRef.id) {
        onSuccess();
      } else {
        throw new Error("Failed to create snippet");
      }
    } catch (error) {
      console.error("Error creating snippet:", error);
      toast({
        title: "Error",
        description: "Failed to create snippet",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Snippet</h1>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter snippet title..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Language
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <div className="relative min-h-[300px] rounded-md border">
                    <CodeEditor
                      code={field.value}
                      language={form.watch("language")}
                      onChange={field.onChange}
                      editable
                      minHeight="300px"
                      maxHeight="600px"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </FormLabel>
            <Input
              onKeyDown={handleTagInput}
              placeholder="Press Enter to add tags"
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-muted-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="saveLocally"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Save locally only</FormLabel>
                </FormItem>
              )}
            />
            <span className="text-sm text-muted-foreground">
              Will sync when online
            </span>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Snippet
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
