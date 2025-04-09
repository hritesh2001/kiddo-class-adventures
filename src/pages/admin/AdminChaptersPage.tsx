
import React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AdminChaptersPage: React.FC = () => {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Chapters</h1>
            <p className="text-gray-500">Add, edit, or remove chapters from your platform</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                The chapters management interface is under development. Please check back later!
              </p>
              <Link to="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminChaptersPage;
