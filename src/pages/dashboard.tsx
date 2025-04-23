import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SnippetList } from "@/components/dashboard/SnippetList";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { db, auth } from "@/lib/firebase";
import NewSnippet from './NewSnippet';

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Timestamp;
}

export default function Dashboard() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [currentView, setCurrentView] = useState<"all" | "favorites" | "shared">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showNewSnippetForm, setShowNewSnippetForm] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    let snippetsQuery = query(
      collection(db, "snippets"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(snippetsQuery, (snapshot) => {
      const snippetsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Snippet[];

      setSnippets(snippetsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, currentView]);

  const handleDeleteSnippet = async (snippetId: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, "snippets", snippetId));
      toast({
        title: "Success",
        description: "Snippet deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete snippet",
      });
    }
  };

  const handleEditSnippet = (snippetId: string) => {
    navigate(`/edit-snippet/${snippetId}`);
  };

  const handleSignOut = () => {
    auth.signOut();
    navigate("/");
  };

  const handleLanguageFilter = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleCreateNew = () => {
    setShowNewSnippetForm(true);
  };

  const handleCancelCreate = () => {
    setShowNewSnippetForm(false);
  };

  const handleSnippetCreated = () => {
    setShowNewSnippetForm(false);
    toast({
      title: "Success",
      description: "Snippet created successfully!",
    });
  };

  const sortSnippets = (snippets: Snippet[]) => {
    switch (sortBy) {
      case "newest":
        return [...snippets].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      case "oldest":
        return [...snippets].sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
      case "name":
        return [...snippets].sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return [...snippets].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return snippets;
    }
  };

  const filteredSnippets = sortSnippets(
    snippets.filter(snippet => 
      (selectedLanguage === "All" || snippet.language.toLowerCase() === selectedLanguage.toLowerCase()) &&
      (selectedLanguages.length === 0 || selectedLanguages.includes(snippet.language)) &&
      (searchQuery === "" || 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        selectedLanguages={selectedLanguages}
        onLanguageChange={setSelectedLanguages}
        view={currentView}
        onViewChange={setCurrentView}
        onCreateNew={handleCreateNew}
      />
      
      <main className="flex-1 relative">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DashboardHeader user={user} onSignOut={handleSignOut} />
        </div>

        <div className="container mx-auto px-4 py-6">
          {showNewSnippetForm ? (
            <NewSnippet onCancel={handleCancelCreate} onSuccess={handleSnippetCreated} />
          ) : (
            <>
              <SearchBar 
                onSearch={setSearchQuery} 
                onSortChange={setSortBy}
                onLanguageFilter={handleLanguageFilter}
                className="mb-6" 
              />
              <SnippetList
                snippets={filteredSnippets}
                loading={loading}
                onDeleteSnippet={handleDeleteSnippet}
                onEditSnippet={handleEditSnippet}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
