
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClassesPage from "./pages/ClassesPage";
import SubjectsPage from "./pages/SubjectsPage";
import ChaptersPage from "./pages/ChaptersPage";
import ChapterDetailPage from "./pages/ChapterDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthProvider";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminClassesPage from "./pages/admin/AdminClassesPage";
import AdminSubjectsPage from "./pages/admin/AdminSubjectsPage";
import AdminChaptersPage from "./pages/admin/AdminChaptersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import VideoPlayerPage from "./pages/VideoPlayerPage";

// Create a new QueryClient instance inside the component
const App = () => {
  // Create a client inside the component to ensure proper React initialization
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/classes/:classId" element={<SubjectsPage />} />
                <Route path="/classes/:classId/subjects" element={<SubjectsPage />} />
                <Route path="/classes/:classId/subjects/:subjectId" element={<ChaptersPage />} />
                {/* <Route path="/classes/:classId/subjects/:subjectId/chapters/:chapterId" element={<ChapterDetailPage />} /> */}
                <Route path="/classes/:classId/subjects/:subjectId/chapters/:chapterId" element={<VideoPlayerPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/classes" element={<AdminClassesPage />} />
                <Route path="/admin/subjects" element={<AdminSubjectsPage />} />
                <Route path="/admin/chapters" element={<AdminChaptersPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/profile" element={<AdminProfilePage />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
