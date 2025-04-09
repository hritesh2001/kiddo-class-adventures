
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { Loader, BookOpen, Users, GraduationCap, BookText } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type CountResult = { count: number };

const fetchClassesCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('classes')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count || 0;
};

const fetchSubjectsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('subjects')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count || 0;
};

const fetchChaptersCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('chapters')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count || 0;
};

const fetchUsersCount = async (): Promise<number> => {
  // In a real application, you would need admin rights to count users
  // For this demo, we'll return a placeholder
  return 120; // Placeholder value
};

const AdminDashboardPage: React.FC = () => {
  const { data: classesCount, isLoading: isClassesLoading } = useQuery({
    queryKey: ['admin', 'classes-count'],
    queryFn: fetchClassesCount,
  });
  
  const { data: subjectsCount, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ['admin', 'subjects-count'],
    queryFn: fetchSubjectsCount,
  });
  
  const { data: chaptersCount, isLoading: isChaptersLoading } = useQuery({
    queryKey: ['admin', 'chapters-count'],
    queryFn: fetchChaptersCount,
  });
  
  const { data: usersCount, isLoading: isUsersLoading } = useQuery({
    queryKey: ['admin', 'users-count'],
    queryFn: fetchUsersCount,
  });
  
  const statCards = [
    {
      title: "Classes",
      value: classesCount,
      icon: <GraduationCap size={24} />,
      loading: isClassesLoading,
      color: "bg-blue-100 text-blue-700",
      link: "/admin/classes"
    },
    {
      title: "Subjects",
      value: subjectsCount,
      icon: <BookOpen size={24} />,
      loading: isSubjectsLoading,
      color: "bg-purple-100 text-purple-700",
      link: "/admin/subjects"
    },
    {
      title: "Chapters",
      value: chaptersCount,
      icon: <BookText size={24} />,
      loading: isChaptersLoading,
      color: "bg-green-100 text-green-700",
      link: "/admin/chapters"
    },
    {
      title: "Users",
      value: usersCount,
      icon: <Users size={24} />,
      loading: isUsersLoading,
      color: "bg-yellow-100 text-yellow-700",
      link: "/admin/users"
    }
  ];
  
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-8">Overview of your educational platform</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <Link to={card.link} key={card.title}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className={`p-2 rounded-full ${card.color}`}>
                      {card.icon}
                    </div>
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {card.loading ? (
                    <div className="flex justify-center">
                      <Loader className="animate-spin" />
                    </div>
                  ) : (
                    <p className="text-3xl font-bold">{card.value}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>The latest actions on your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-gray-500">Activity tracking will be implemented in future updates</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link to="/admin/classes/new">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <GraduationCap className="mb-2 text-blue-500" />
                    <p>Add New Class</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/subjects/new">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <BookOpen className="mb-2 text-purple-500" />
                    <p>Add New Subject</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/chapters/new">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <BookText className="mb-2 text-green-500" />
                    <p>Add New Chapter</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/users">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Users className="mb-2 text-yellow-500" />
                    <p>Manage Users</p>
                  </CardContent>
                </Card>
              </Link>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
