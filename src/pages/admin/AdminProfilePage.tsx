
import React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail } from "lucide-react";

const AdminProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const getUserInitials = () => {
    if (!user || !user.email) return "?";
    return user.email.substring(0, 2).toUpperCase();
  };
  
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-500">View and manage your account information</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-kiddo-purple text-white text-2xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user?.email}</CardTitle>
              <CardDescription>Admin User</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">Edit Profile</Button>
                <Button className="w-full" variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center border-b pb-4">
                  <Mail className="mr-2 text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center border-b pb-4">
                  <User className="mr-2 text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-xs">{user?.id}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-2">Admin Access</p>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full inline-flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
