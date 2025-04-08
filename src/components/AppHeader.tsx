
import React from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, Users, GraduationCap, Smile, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MobileMenu } from "./MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export const AppHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Classes", path: "/classes", icon: <BookOpen size={18} /> },
    { name: "About Us", path: "/about", icon: <Users size={18} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={18} /> },
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
            <GraduationCap size={isMobile ? 20 : 24} />
          </motion.div>
          {!isMobile ? (
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-kiddo-blue to-kiddo-purple text-transparent bg-clip-text"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Kiddo Class Adventures
            </motion.span>
          ) : (
            <motion.span 
              className="text-lg font-bold bg-gradient-to-r from-kiddo-blue to-kiddo-purple text-transparent bg-clip-text"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Kiddo
            </motion.span>
          )}
        </Link>

        {/* Mobile Menu Integration */}
        <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />

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
      </div>
    </header>
  );
};
