import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="hover:opacity-80">
          <h1 className="text-2xl font-bold text-primary">Snippet Manager</h1>
          <p className="text-sm text-muted-foreground">Organize and share your code snippets effortlessly</p>
        </Link>
        
        <nav className="hidden md:flex gap-4">
          <Link to="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost">Contact</Button>
          </Link>
          <Link to="/get-started">
            <Button variant="default">Get Started</Button>
          </Link>
        </nav>

        <Button 
          variant="outline" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden py-4 px-4 border-t">
          <div className="container mx-auto flex flex-col gap-2">
            <Link to="/about" className="w-full">
              <Button variant="ghost" className="w-full justify-start">About</Button>
            </Link>
            <Link to="/contact" className="w-full">
              <Button variant="ghost" className="w-full justify-start">Contact</Button>
            </Link>
            <Link to="/get-started" className="w-full">
              <Button variant="default" className="w-full justify-start">Get Started</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}