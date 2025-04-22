export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-6 mb-4 md:mb-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} Snippet Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}