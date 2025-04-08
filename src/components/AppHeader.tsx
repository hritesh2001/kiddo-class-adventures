
import React from "react";
import { Link } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AppHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-md py-3 sticky top-0 z-50">
      <div className="kiddo-container flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={() => setMenuOpen(false)}
        >
          <div className="bg-kiddo-purple text-white p-2 rounded-full">
            <Home size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-kiddo-blue to-kiddo-purple text-transparent bg-clip-text">
            Kiddo Class Adventures
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="font-semibold hover:text-kiddo-blue transition-colors">
            Home
          </Link>
          <Link to="/about" className="font-semibold hover:text-kiddo-blue transition-colors">
            About
          </Link>
          <Button className="bg-kiddo-yellow text-kiddo-dark hover:bg-yellow-400 transition-colors">
            Login
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 md:hidden animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="font-semibold hover:text-kiddo-blue transition-colors p-2"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="font-semibold hover:text-kiddo-blue transition-colors p-2"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Button className="bg-kiddo-yellow text-kiddo-dark hover:bg-yellow-400 transition-colors">
                Login
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
