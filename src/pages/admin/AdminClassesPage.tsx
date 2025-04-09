
import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, Loader, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Class = Database['public']['Tables']['classes']['Row'];

const fetchClasses = async (): Promise<Class[]> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('id');
  
  if (error) throw error;
  return data || [];
};

const AdminClassesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    color: 'blue'
  });
  
  // Query for fetching classes
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['admin', 'classes'],
    queryFn: fetchClasses,
  });
  
  // Mutation for creating a class
  const createClassMutation = useMutation({
    mutationFn: async (newClass: { name: string; description: string; color: string }) => {
      const { data, error } = await supabase
        .from('classes')
        .insert([newClass])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'classes'] });
      toast.success('Class created successfully');
      setIsAddDialogOpen(false);
      setNewClass({ name: '', description: '', color: 'blue' });
    },
    onError: (error) => {
      toast.error('Failed to create class', {
        description: error.message
      });
    }
  });
  
  // Mutation for updating a class
  const updateClassMutation = useMutation({
    mutationFn: async (updatedClass: Class) => {
      const { data, error } = await supabase
        .from('classes')
        .update({
          name: updatedClass.name,
          description: updatedClass.description,
          color: updatedClass.color
        })
        .eq('id', updatedClass.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'classes'] });
      toast.success('Class updated successfully');
      setIsEditDialogOpen(false);
      setSelectedClass(null);
    },
    onError: (error) => {
      toast.error('Failed to update class', {
        description: error.message
      });
    }
  });
  
  // Mutation for deleting a class
  const deleteClassMutation = useMutation({
    mutationFn: async (classId: number) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'classes'] });
      toast.success('Class deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedClass(null);
    },
    onError: (error) => {
      toast.error('Failed to delete class', {
        description: error.message
      });
    }
  });
  
  // Handle opening the edit dialog
  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsEditDialogOpen(true);
  };
  
  // Handle opening the delete dialog
  const handleDelete = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDeleteDialogOpen(true);
  };
  
  // Color options for classes
  const colorOptions = [
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Purple', value: 'purple' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Pink', value: 'pink' },
    { name: 'Orange', value: 'orange' },
  ];
  
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Classes</h1>
            <p className="text-gray-500">Add, edit, or remove classes from your platform</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="bg-kiddo-purple hover:bg-kiddo-purple/90"
          >
            <Plus size={18} className="mr-2" />
            Add New Class
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="animate-spin mr-2" />
                <span>Loading classes...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40 text-red-500">
                <AlertCircle className="mr-2" />
                <span>Error loading classes</span>
              </div>
            ) : classes && classes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>{classItem.id}</TableCell>
                      <TableCell className="font-medium">{classItem.name}</TableCell>
                      <TableCell>{classItem.description}</TableCell>
                      <TableCell>
                        <span className={`inline-block w-6 h-6 rounded-full bg-kiddo-${classItem.color} mr-2`}></span>
                        {classItem.color}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(classItem)}
                          className="mr-2"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(classItem)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No classes found</p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="bg-kiddo-purple hover:bg-kiddo-purple/90"
                >
                  <Plus size={18} className="mr-2" />
                  Add First Class
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Add Class Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Add a new class to your educational platform
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            createClassMutation.mutate(newClass);
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  placeholder="e.g. Class 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newClass.description}
                  onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                  placeholder="Brief description of this class"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <div 
                      key={color.value}
                      className={`border rounded-md p-2 flex items-center cursor-pointer ${
                        newClass.color === color.value ? 'border-kiddo-purple ring-2 ring-kiddo-purple/20' : 'border-gray-200'
                      }`}
                      onClick={() => setNewClass({...newClass, color: color.value})}
                    >
                      <span className={`inline-block w-4 h-4 rounded-full bg-kiddo-${color.value} mr-2`}></span>
                      <span>{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-kiddo-purple hover:bg-kiddo-purple/90"
                disabled={createClassMutation.isPending}
              >
                {createClassMutation.isPending && <Loader size={16} className="animate-spin mr-2" />}
                Add Class
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update this class's information
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (selectedClass) updateClassMutation.mutate(selectedClass);
            }}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Class Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedClass.name}
                    onChange={(e) => setSelectedClass({...selectedClass, name: e.target.value})}
                    placeholder="e.g. Class 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={selectedClass.description || ''}
                    onChange={(e) => setSelectedClass({...selectedClass, description: e.target.value})}
                    placeholder="Brief description of this class"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Color</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {colorOptions.map((color) => (
                      <div 
                        key={color.value}
                        className={`border rounded-md p-2 flex items-center cursor-pointer ${
                          selectedClass.color === color.value ? 'border-kiddo-purple ring-2 ring-kiddo-purple/20' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedClass({...selectedClass, color: color.value})}
                      >
                        <span className={`inline-block w-4 h-4 rounded-full bg-kiddo-${color.value} mr-2`}></span>
                        <span>{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-kiddo-purple hover:bg-kiddo-purple/90"
                  disabled={updateClassMutation.isPending}
                >
                  {updateClassMutation.isPending && <Loader size={16} className="animate-spin mr-2" />}
                  Update Class
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Class Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be undone and will also delete all associated subjects and chapters.
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <div>
              <div className="my-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedClass.name}</p>
                <p className="text-sm text-gray-500">{selectedClass.description}</p>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => selectedClass && deleteClassMutation.mutate(selectedClass.id)}
                  disabled={deleteClassMutation.isPending}
                >
                  {deleteClassMutation.isPending && <Loader size={16} className="animate-spin mr-2" />}
                  Delete Class
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminClassesPage;
