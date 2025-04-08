
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  X,
  Home, 
  BookOpen, 
  Users, 
  Phone,
  LogIn,
  Moon,
  Sun,
} from "lucide-react";

type MobileMenuProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Classes", path: "/classes", icon: <BookOpen size={18} /> },
    { name: "About Us", path: "/about", icon: <Users size={18} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={18} /> },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Would implement actual dark mode toggle functionality here
  };

  if (!isMobile) return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="py-4">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl font-bold text-kiddo-blue">
            Kiddo Class Adventures
          </DrawerTitle>
          <DrawerClose className="absolute right-4 top-4">
            <X size={24} />
          </DrawerClose>
        </DrawerHeader>
        
        <div className="flex flex-col space-y-1 p-4">
          {menuItems.map((item) => (
            <motion.div
              key={item.path}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={item.path} 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="p-2 rounded-full bg-kiddo-purple/10">
                  {item.icon}
                </div>
                <span className="font-semibold">{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <DrawerFooter className="flex flex-col gap-2">
          <Button className="w-full bg-kiddo-yellow text-kiddo-dark hover:bg-yellow-400">
            <LogIn className="mr-2" size={18} />
            Login
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex justify-between items-center"
            onClick={toggleDarkMode}
          >
            <span>Theme</span>
            <div className="p-1 rounded-full bg-gray-100">
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            </div>
          </Button>
          
          <div className="text-center text-xs text-gray-500 pt-2">
            <p>Version 1.0.0</p>
            <p>© 2025 Kiddo Class Adventures</p>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
