import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Define Types
type Class = Database['public']['Tables']['classes']['Row'];

const fetchClasses = async (): Promise<Class[]> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('id');
  
  if (error) {
    console.error("Error fetching classes:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

const ClassesPage = () => {
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });

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

  // Show error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load classes", {
        description: "Please try again later"
      });
    }
  }, [error]);

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
          {isLoading ? (
            // Skeleton loading UI
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="kiddo-card">
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-16 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))
          ) : classes && classes.length > 0 ? (
            classes.map((classItem) => (
              <motion.div key={classItem.id} variants={itemVariants}>
                <Link to={`/classes/${classItem.id}`}>
                  <div className={`kiddo-card border-kiddo-${classItem.color} overflow-hidden`}>
                    <div className={`bg-kiddo-${classItem.color} h-24 flex items-center justify-center`}>
                      <span className="text-4xl font-bold text-white">Class {classItem.id}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{classItem.name}</h3>
                      <p className="text-gray-600 mb-4">
                        {classItem.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">6 Subjects</span>
                        <span className={`text-kiddo-${classItem.color} font-bold`}>
                          Start Learning →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No classes found</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ClassesPage;
