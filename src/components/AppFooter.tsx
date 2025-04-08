
import React from "react";
import { motion } from "framer-motion";
import { Heart, Mail, MessageCircle } from "lucide-react";

export const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-kiddo-blue text-white py-6">
      <div className="kiddo-container">
        <div className="text-center md:flex md:justify-between md:items-center">
          <motion.div 
            className="mb-4 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold">Kiddo Class Adventures</h3>
            <p className="text-sm mt-1">Learning Made Fun & Interactive</p>
          </motion.div>
          <motion.div 
            className="space-x-4 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a href="#" className="hover:underline flex items-center gap-1">
              <Mail size={16} /> Contact
            </a>
            <a href="#" className="hover:underline flex items-center gap-1">
              <MessageCircle size={16} /> Help
            </a>
            <a href="#" className="hover:underline flex items-center gap-1">
              <Heart size={16} /> About
            </a>
          </motion.div>
        </div>
        <motion.div 
          className="text-center mt-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-center items-center gap-1">
            <Heart size={14} className="text-kiddo-pink" />
            <span>&copy; {currentYear} Kiddo Class Adventures. All rights reserved.</span>
            <Heart size={14} className="text-kiddo-pink" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
