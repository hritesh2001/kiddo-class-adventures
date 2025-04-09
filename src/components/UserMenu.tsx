
import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { LoginModal } from "./LoginModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const getUserInitials = () => {
    if (!user || !user.email) return "?";
    return user.email.substring(0, 2).toUpperCase();
  };
  
  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-kiddo-purple text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <Link to="/admin">
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <Settings size={16} />
                <span>Admin Panel</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem 
              className="cursor-pointer flex items-center gap-2 text-red-600"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-kiddo-purple hover:bg-kiddo-purple/90"
        >
          Sign In
        </Button>
      )}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};
