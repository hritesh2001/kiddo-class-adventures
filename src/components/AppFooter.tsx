
import React from "react";
import { motion } from "framer-motion";
import { Heart, Mail, MessageCircle, Star, Music, Gamepad } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-gradient-to-r from-kiddo-blue to-kiddo-purple text-white py-6">
      <div className="kiddo-container">
        <div className="text-center md:flex md:justify-between md:items-center">
          <motion.div 
            className="mb-4 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold">Kiddo Class Adventures</h3>
            <motion.p 
              className="text-sm mt-1"
              animate={{ 
                color: ["#fff", "#FFC300", "#F72585", "#4CC9F0", "#fff"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Learning Made Fun & Interactive
            </motion.p>
          </motion.div>
          <motion.div 
            className="space-x-4 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
            >
              <Link
                to="/contact" 
                className="hover:underline flex items-center gap-1 hover:text-kiddo-yellow transition-colors"
              >
                <Mail size={16} /> Contact
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
            >
              <Link
                to="#" 
                className="hover:underline flex items-center gap-1 hover:text-kiddo-yellow transition-colors"
              >
                <MessageCircle size={16} /> Help
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
            >
              <Link
                to="/about" 
                className="hover:underline flex items-center gap-1 hover:text-kiddo-yellow transition-colors"
              >
                <Heart size={16} /> About
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Fun Footer Icons */}
        <motion.div 
          className="flex justify-center gap-6 mt-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[Star, Gamepad, Music, Heart].map((Icon, index) => (
            <motion.div
              key={index}
              className="text-white opacity-70 hover:opacity-100"
              whileHover={{ 
                scale: 1.2, 
                rotate: 10,
                color: "#FFC300" 
              }}
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{ 
                duration: 2, 
                delay: index * 0.3,
                repeat: Infinity 
              }}
            >
              <Icon size={isMobile ? 16 : 20} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-center items-center gap-1">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                color: ["#F72585", "#FFC300", "#F72585"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={14} />
            </motion.div>
            <span>&copy; {currentYear} Kiddo Class Adventures. All rights reserved.</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                color: ["#F72585", "#FFC300", "#F72585"]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Heart size={14} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
