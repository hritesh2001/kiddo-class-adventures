
import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ChevronRight, User, Users, BookOpen, GraduationCap, Settings, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // If not logged in, redirect to login
  if (!isLoading && !user) {
    toast.error("You must be logged in to access the admin area");
    return <Navigate to="/" replace />;
  }
  
  // In a real application, you would check if the user has admin permissions
  // For now, we'll assume all logged-in users are admins
  
  // Define admin navigation items
  const navItems = [
    { label: "Dashboard", path: "/admin", icon: <Settings size={18} /> },
    { label: "Classes", path: "/admin/classes", icon: <GraduationCap size={18} /> },
    { label: "Subjects", path: "/admin/subjects", icon: <BookOpen size={18} /> },
    { label: "Chapters", path: "/admin/chapters", icon: <FileText size={18} /> },
    { label: "Users", path: "/admin/users", icon: <Users size={18} /> },
    { label: "Your Profile", path: "/admin/profile", icon: <User size={18} /> },
  ];
  
  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto fixed left-0 top-0"
      >
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <motion.div 
              className="bg-gradient-to-r from-kiddo-purple to-kiddo-blue text-white p-2 rounded-full"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <GraduationCap size={22} />
            </motion.div>
            <span className="font-bold text-xl bg-gradient-to-r from-kiddo-blue to-kiddo-purple text-transparent bg-clip-text">
              Admin Panel
            </span>
          </Link>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link to={item.path}>
                    <Button 
                      variant={isActive ? "default" : "ghost"} 
                      className={`w-full justify-start ${isActive ? 'bg-kiddo-purple hover:bg-kiddo-purple/90' : ''}`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                      {isActive && <ChevronRight className="ml-auto" size={16} />}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Site
            </Button>
          </Link>
        </div>
      </motion.aside>
      
      {/* Admin Content */}
      <main className="ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};
