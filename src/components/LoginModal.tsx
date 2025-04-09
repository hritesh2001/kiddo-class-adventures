
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLoginView) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Logged in successfully");
        onClose();
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success("Account created successfully! Please check your email to verify your account.");
        setIsLoginView(true);
      }
    } catch (error: any) {
      toast.error(isLoginView ? "Login failed" : "Sign up failed", {
        description: error.message || "An error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLoginView ? "Login" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {isLoginView 
              ? "Sign in to track your learning progress" 
              : "Create an account to start your learning journey"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? "Create Account" : "Back to Login"}
            </Button>
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-kiddo-purple hover:bg-kiddo-purple/90"
              disabled={isLoading}
            >
              {isLoading 
                ? "Processing..." 
                : isLoginView 
                  ? "Sign In" 
                  : "Sign Up"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
