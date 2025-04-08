
import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Adding framer-motion for animations
<lov-add-dependency>framer-motion@latest</lov-add-dependency>

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
              <Button className="kiddo-button bg-kiddo-green text-xl">
                Start Learning
              </Button>
            </Link>
          </motion.div>
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="https://img.freepik.com/free-vector/hand-drawn-colorful-science-education-wallpaper_23-2148489183.jpg" 
              alt="Kids learning" 
              className="w-full max-w-md rounded-3xl shadow-lg animate-bounce-slow"
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
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Class</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((classNum) => (
              <Link to={`/classes/${classNum}`} key={classNum}>
                <motion.div 
                  className={`kiddo-card border-kiddo-${getClassColor(classNum)} h-40 flex items-center justify-center`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className={`text-4xl font-bold text-kiddo-${getClassColor(classNum)}`}>
                      {classNum}
                    </div>
                    <div className="mt-2 font-semibold">Class {classNum}</div>
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
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="kiddo-card p-6 border-kiddo-blue">
              <div className="bg-kiddo-blue text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Interactive Lessons</h3>
              <p className="text-center">Engaging, animated lessons that make learning fun and memorable.</p>
            </div>
            <div className="kiddo-card p-6 border-kiddo-yellow">
              <div className="bg-kiddo-yellow text-kiddo-dark p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Track Progress</h3>
              <p className="text-center">Monitor learning journey with colorful progress indicators.</p>
            </div>
            <div className="kiddo-card p-6 border-kiddo-purple">
              <div className="bg-kiddo-purple text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"></circle></svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Learn at Your Pace</h3>
              <p className="text-center">Flexible learning that adapts to each child's individual needs.</p>
            </div>
          </div>
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
