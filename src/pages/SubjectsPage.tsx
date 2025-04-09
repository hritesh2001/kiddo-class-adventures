
import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Define Types
type Subject = {
  id: number;
  name: string;
  icon: string;
  color: string;
  chapters_count: number;
  class_id: number;
}

type Class = {
  id: number;
  name: string;
  description: string;
  color: string;
}

const fetchSubjects = async (classId: number): Promise<Subject[]> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('class_id', classId)
    .order('id');
  
  if (error) {
    console.error("Error fetching subjects:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

const fetchClass = async (classId: number): Promise<Class | null> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .single();
  
  if (error) {
    console.error("Error fetching class:", error);
    throw new Error(error.message);
  }
  
  return data;
};

const SubjectsPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const classIdNum = parseInt(classId || "1");

  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useQuery({
    queryKey: ['subjects', classIdNum],
    queryFn: () => fetchSubjects(classIdNum),
  });

  const { data: classInfo, isLoading: classLoading } = useQuery({
    queryKey: ['class', classIdNum],
    queryFn: () => fetchClass(classIdNum),
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
    if (subjectsError) {
      toast.error("Failed to load subjects", {
        description: "Please try again later"
      });
    }
  }, [subjectsError]);

  return (
    <AppLayout>
      <div className="kiddo-container py-8">
        <Link to="/classes">
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <ArrowLeft size={18} />
            <span>Back to Classes</span>
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {classLoading ? (
              <Skeleton className="h-10 w-48 mx-auto" />
            ) : (
              `${classInfo?.name || `Class ${classIdNum}`} Subjects`
            )}
          </h1>
          <p className="text-gray-600">
            Select a subject to explore chapters and start learning
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subjectsLoading ? (
            // Skeleton loading UI
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="kiddo-card">
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          ) : subjects && subjects.length > 0 ? (
            subjects.map((subject) => (
              <motion.div key={subject.id} variants={itemVariants}>
                <Link to={`/classes/${classIdNum}/subjects/${subject.id}`}>
                  <div className={`kiddo-card border-kiddo-${subject.color} overflow-hidden h-full`}>
                    <div className={`bg-kiddo-${subject.color} p-8 flex flex-col items-center justify-center`}>
                      {getSubjectIcon(subject.icon)}
                      <h3 className="text-xl font-bold text-white mt-3">{subject.name}</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{subject.chapters_count} Chapters</span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                            20%
                          </div>
                        </div>
                      </div>
                      <Button className={`w-full mt-4 bg-kiddo-${subject.color} hover:bg-opacity-90`}>
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No subjects found for this class</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

// Helper function to render subject icons
function getSubjectIcon(iconName: string): JSX.Element {
  const iconStyle = "w-12 h-12 text-white";
  
  switch (iconName) {
    case "calculator":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /><path d="M8 16h.01" /><path d="M12 16h.01" /><path d="M12 20h.01" /><path d="M8 20h.01" /></svg>
      );
    case "book":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
      );
    case "flask":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v2H9zM8 3h8l-1 6.5.5.5-5 8v.5h-.5l-.5-.5-1-1 5-8 .5-.5L8 3z" /><path d="M6.5 20A3.5 3.5 0 0 1 3 16.5v-.74A5 5 0 0 1 4.5 11l.5-2 5 8H8.5L7 14l3 4H6.5zM17.5 20a3.5 3.5 0 0 0 3.5-3.5v-.74A5 5 0 0 0 19.5 11l-.5-2-5 8h1.5l1.5-3-3 4h3.5z" /></svg>
      );
    case "globe":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
      );
    case "palette":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
      );
    case "monitor":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      );
  }
}

export default SubjectsPage;
