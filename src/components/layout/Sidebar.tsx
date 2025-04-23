import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Plus, Archive, Star, Share2, Code2 } from "lucide-react";

interface SidebarProps {
  selectedLanguages: string[];
  onLanguageChange: (languages: string[]) => void;
  view: "all" | "favorites" | "shared";
  onViewChange: (view: "all" | "favorites" | "shared") => void;
  onCreateNew: () => void;
  className?: string;
}

export function Sidebar({
  selectedLanguages,
  onLanguageChange,
  view,
  onViewChange,
  onCreateNew,
  className
}: SidebarProps) {
  const languages = ["JavaScript", "Python", "Java"];

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      onLanguageChange(selectedLanguages.filter(l => l !== language));
    } else {
      onLanguageChange([...selectedLanguages, language]);
    }
  };

  return (
    <aside className={cn("w-64 border-r bg-background p-6", className)}>
      <Button 
        className="w-full mb-6" 
        onClick={onCreateNew}
      >
        <Plus className="w-4 h-4 mr-2" />
        New Snippet
      </Button>

      <nav className="space-y-6">
        <div className="space-y-2">
          <Button
            variant={view === "all" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("all")}
          >
            <Archive className="w-4 h-4 mr-2" />
            All Snippets
          </Button>
          <Button
            variant={view === "favorites" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("favorites")}
          >
            <Star className="w-4 h-4 mr-2" />
            Favorites
          </Button>
          <Button
            variant={view === "shared" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("shared")}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Shared
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <h3 className="font-semibold">Languages</h3>
          </div>
          {languages.map((language) => (
            <div 
              key={language} 
              className="flex items-center space-x-2 hover:bg-accent rounded-sm px-2 py-1.5 transition-colors"
            >
              <Checkbox
                id={language}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={() => toggleLanguage(language)}
              />
              <label
                htmlFor={language}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
              >
                {language}
              </label>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}