
import React from "react";
import { Link } from "react-router-dom";
import { Home, Menu, X, BookOpen, Users, Award, GraduationCap, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const AppHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Classes", path: "/classes", icon: <BookOpen size={18} /> },
    { name: "About Us", path: "/about", icon: <Users size={18} /> },
  ];

  return (
    <header className="bg-white shadow-md py-3 sticky top-0 z-50">
      <div className="kiddo-container flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={() => setMenuOpen(false)}
        >
          <motion.div 
            className="bg-gradient-to-r from-kiddo-purple to-kiddo-blue text-white p-2 rounded-full"
            whileHover={{ rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <GraduationCap size={24} />
          </motion.div>
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-kiddo-blue to-kiddo-purple text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Kiddo Class Adventures
          </motion.span>
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
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link 
                to={item.path} 
                className="font-semibold hover:text-kiddo-blue transition-colors flex items-center gap-2 relative group"
              >
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-kiddo-blue"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
                {item.icon}
                {item.name}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button className="bg-kiddo-yellow text-kiddo-dark hover:bg-yellow-400 transition-colors group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-block mr-2"
              >
                <Smile size={18} />
              </motion.div>
              Login
            </Button>
          </motion.div>
        </nav>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 md:hidden animate-fade-in">
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className="font-semibold hover:text-kiddo-blue transition-colors p-2 flex items-center gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {item.icon}
                  </motion.div>
                  {item.name}
                </Link>
              ))}
              <Button className="bg-kiddo-yellow text-kiddo-dark hover:bg-yellow-400 transition-colors">
                <Smile className="mr-2" size={18} />
                Login
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
