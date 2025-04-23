import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSortChange: (value: string) => void;
  onLanguageFilter?: (language: string) => void;
  className?: string;
}

const languages = [
  "All",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "HTML",
  "CSS",
  "SQL",
  "JSON",
  "Markdown"
];

export function SearchBar({ onSearch, onSortChange, onLanguageFilter, className }: SearchBarProps) {
  return (
    <div className={`${className} flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full`}>
      <div className="flex-1">
        <Input
          placeholder="Search snippets..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-4">
        <Select onValueChange={onLanguageFilter} defaultValue="All">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onSortChange} defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}