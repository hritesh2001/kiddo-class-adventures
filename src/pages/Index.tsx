
import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Star, Lightbulb, Rocket, Award, Gift } from "lucide-react";

const Index = () => {
  return (
    <AppLayout>
      <div className="kiddo-container py-8">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between py-10">
          <motion.div 
            className="md:w-1/2 mt-8 md:mt-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-kiddo-purple to-kiddo-blue text-transparent bg-clip-text">
              Learn Through Play with Kiddo Class Adventures!
            </h1>
            <p className="text-lg mb-6">
              A fun interactive learning platform for primary school students. Explore subjects, master chapters, and enjoy the journey of knowledge!
            </p>
            <Link to="/classes">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="kiddo-button bg-kiddo-green text-xl group">
                  Start Learning
                  <Rocket className="ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.img 
              src="https://img.freepik.com/free-vector/hand-drawn-colorful-science-education-wallpaper_23-2148489183.jpg" 
              alt="Kids learning" 
              className="w-full max-w-md rounded-3xl shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </div>

        {/* Class Selection */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
            <BookOpen className="mr-2 text-kiddo-blue" />
            Choose Your Class
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((classNum) => (
              <Link to={`/classes/${classNum}`} key={classNum}>
                <motion.div 
                  className={`kiddo-card border-kiddo-${getClassColor(classNum)} h-40 flex items-center justify-center kiddo-shine`}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: 2,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className={`text-4xl font-bold text-kiddo-${getClassColor(classNum)}`}
                      whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {classNum}
                    </motion.div>
                    <div className="mt-2 font-semibold">Class {classNum}</div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="mt-1"
                    >
                      <Star className={`inline-block text-kiddo-${getClassColor(classNum)}`} size={16} />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
            <Lightbulb className="mr-2 text-kiddo-yellow" />
            Fun Learning Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="kiddo-card p-6 border-kiddo-blue"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="bg-kiddo-blue text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <BookOpen size={24} />
              </motion.div>
              <h3 className="text-xl font-bold text-center mb-2">Interactive Lessons</h3>
              <p className="text-center">Engaging, animated lessons that make learning fun and memorable.</p>
            </motion.div>
            <motion.div 
              className="kiddo-card p-6 border-kiddo-yellow"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="bg-kiddo-yellow text-kiddo-dark p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <Award size={24} />
              </motion.div>
              <h3 className="text-xl font-bold text-center mb-2">Track Progress</h3>
              <p className="text-center">Monitor learning journey with colorful progress indicators and rewards.</p>
            </motion.div>
            <motion.div 
              className="kiddo-card p-6 border-kiddo-purple"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="bg-kiddo-purple text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <Gift size={24} />
              </motion.div>
              <h3 className="text-xl font-bold text-center mb-2">Learn at Your Pace</h3>
              <p className="text-center">Flexible learning that adapts to each child's individual needs and abilities.</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          className="mt-20 text-center pb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Adventure?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Join thousands of happy students exploring the wonderful world of knowledge with fun games and activities!</p>
          <Link to="/classes">
            <motion.button 
              className="kiddo-button bg-kiddo-pink text-white px-8 py-4 text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Your Journey
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </AppLayout>
  );
};

// Helper function to get color based on class number
function getClassColor(classNum: number): string {
  const colors = ["blue", "yellow", "purple", "green", "pink", "orange"];
  return colors[(classNum - 1) % colors.length];
}

export default Index;
