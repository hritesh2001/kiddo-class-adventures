
import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ClassesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <AppLayout>
      <div className="kiddo-container py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Button>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Select Your Class
        </h1>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[1, 2, 3, 4, 5, 6].map((classNum) => (
            <motion.div key={classNum} variants={itemVariants}>
              <Link to={`/classes/${classNum}`}>
                <div className={`kiddo-card border-kiddo-${getClassColor(classNum)} overflow-hidden`}>
                  <div className={`bg-kiddo-${getClassColor(classNum)} h-24 flex items-center justify-center`}>
                    <span className="text-4xl font-bold text-white">Class {classNum}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Primary {classNum}</h3>
                    <p className="text-gray-600 mb-4">
                      {getClassDescription(classNum)}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">6 Subjects</span>
                      <span className={`text-kiddo-${getClassColor(classNum)} font-bold`}>
                        Start Learning →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
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

// Helper function to get description based on class number
function getClassDescription(classNum: number): string {
  const descriptions = [
    "Foundation year with basics in reading, writing, and numbers.",
    "Building literacy skills and exploring math concepts.",
    "Developing reading comprehension and mathematical operations.",
    "Expanding knowledge in languages, math, and science.",
    "Deepening understanding across all core subjects.",
    "Advanced concepts preparing for secondary education."
  ];
  return descriptions[classNum - 1];
}

export default ClassesPage;
