
import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Download, Share2 } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/integrations/supabase/types";

// Define Types
type Chapter = Database['public']['Tables']['chapters']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];
type UserProgress = Database['public']['Tables']['user_progress']['Row'];

// Mock data for videos (in a real app, this would come from a database)
const getChapterVideos = (subjectName: string, chapterId: number, chapterTitle: string) => {
  return [
    {
      id: 1,
      title: `${subjectName} - Lesson ${chapterId}.1`,
      description: "Introduction to the basic concepts",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnail: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
      duration: "4:12"
    },
    {
      id: 2,
      title: `${subjectName} - Lesson ${chapterId}.2`,
      description: "Interactive examples and exercises",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnail: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
      duration: "3:45"
    },
    {
      id: 3,
      title: `${subjectName} - Lesson ${chapterId}.3`,
      description: "Practice problems and applications",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnail: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
      duration: "5:20"
    }
  ];
};

const fetchChapter = async (chapterId: number): Promise<Chapter | null> => {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single();
  
  if (error) {
    console.error("Error fetching chapter:", error);
    throw new Error(error.message);
  }
  
  return data;
};

const fetchSubject = async (subjectId: number): Promise<Subject | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .single();
  
  if (error) {
    console.error("Error fetching subject:", error);
    throw new Error(error.message);
  }
  
  return data;
};

const fetchUserProgress = async (chapterId: number): Promise<UserProgress | null> => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('chapter_id', chapterId)
    .eq('user_id', sessionData.session.user.id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
  
  return data;
};

const updateUserProgress = async ({ 
  chapter_id, 
  progress, 
  completed 
}: { 
  chapter_id: number;
  progress: number;
  completed: boolean;
}) => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error("User not authenticated");
  
  const userId = sessionData.session.user.id;
  
  // Check if progress record exists
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('id')
    .eq('chapter_id', chapter_id)
    .eq('user_id', userId)
    .maybeSingle();
  
  if (existingProgress) {
    // Update existing record
    const { data, error } = await supabase
      .from('user_progress')
      .update({
        progress,
        completed,
        last_accessed: new Date().toISOString()
      })
      .eq('id', existingProgress.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        chapter_id,
        user_id: userId,
        progress,
        completed,
        last_accessed: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

const ChapterDetailPage = () => {
  const { classId, subjectId, chapterId } = useParams<{ 
    classId: string;
    subjectId: string;
    chapterId: string;
  }>();
  const isMobile = useIsMobile();
  
  const classIdNum = parseInt(classId || "1");
  const subjectIdNum = parseInt(subjectId || "1");
  const chapterIdNum = parseInt(chapterId || "1");
  
  const { data: chapter, isLoading: chapterLoading, error: chapterError } = useQuery({
    queryKey: ['chapter', chapterIdNum],
    queryFn: () => fetchChapter(chapterIdNum),
  });

  const { data: subject, isLoading: subjectLoading } = useQuery({
    queryKey: ['subject-detail', subjectIdNum],
    queryFn: () => fetchSubject(subjectIdNum),
    enabled: !!chapter,
  });

  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['progress', chapterIdNum],
    queryFn: () => fetchUserProgress(chapterIdNum),
  });
  
  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: updateUserProgress,
    onSuccess: () => {
      toast.success("Progress updated");
    },
    onError: (error) => {
      toast.error("Failed to update progress", { 
        description: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // When the user watches a video or interacts with content, update their progress
  const handleProgressUpdate = (newProgress: number) => {
    // Only update if user is logged in
    const isCompleted = newProgress >= 100;
    updateProgressMutation.mutate({
      chapter_id: chapterIdNum,
      progress: newProgress,
      completed: isCompleted
    });
  };
  
  // Generate videos based on chapter and subject
  const videos = React.useMemo(() => {
    if (!subject || !chapter) return [];
    return getChapterVideos(subject.name, chapter.order_number, chapter.title);
  }, [subject, chapter]);
  
  const [selectedVideo, setSelectedVideo] = React.useState(videos[0]);
  
  // Update selected video when videos change
  React.useEffect(() => {
    if (videos.length > 0) {
      setSelectedVideo(videos[0]);
    }
  }, [videos]);
  
  // Show error toast if there's an error
  React.useEffect(() => {
    if (chapterError) {
      toast.error("Failed to load chapter", {
        description: "Please try again later"
      });
    }
  }, [chapterError]);
  
  const downloadVideo = () => {
    toast("Download started", {
      description: "Your video is being downloaded..."
    });
  };
  
  const shareContent = () => {
    toast("Share", {
      description: "Sharing functionality will be implemented soon!"
    });
  };
  
  // Auto-update progress when watching video (simulated)
  React.useEffect(() => {
    if (!userProgress) return;
    
    // If progress is less than 33%, update it to 33% when viewing the chapter
    if (userProgress.progress < 33) {
      handleProgressUpdate(33);
    }
  }, [userProgress]);
  
  return (
    <AppLayout>
      <div className="kiddo-container py-6">
        <Link to={`/classes/${classId}/subjects/${subjectId}`}>
          <Button variant="ghost" className="mb-4 flex items-center gap-2">
            <ArrowLeft size={18} />
            <span>Back to Chapters</span>
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {(chapterLoading || subjectLoading) ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                </div>
              ) : chapter && subject ? (
                <>
                  <div className="mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      Chapter {chapter.order_number}: {chapter.title}
                    </h1>
                    <p className="text-gray-600">
                      {subject.name} • Class {classIdNum}
                    </p>
                  </div>
                  
                  {selectedVideo && (
                    <VideoPlayer 
                      src={selectedVideo.videoUrl} 
                      poster={selectedVideo.thumbnail}
                    />
                  )}
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={downloadVideo}
                    >
                      <Download size={16} />
                      Download Material
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={shareContent}
                    >
                      <Share2 size={16} />
                      Share
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <h2 className="text-xl font-bold mb-3">About this chapter</h2>
                    <p className="text-gray-700">
                      {chapter.description || 
                        `In this chapter, students will learn about ${chapter.title.toLowerCase()} through interactive videos, 
                        engaging activities, and fun exercises. The content is designed to make learning enjoyable while 
                        building a strong foundation in ${subject.name.toLowerCase()}.`
                      }
                    </p>
                    {chapter.content && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        {chapter.content}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chapter not found</p>
                </div>
              )}
            </motion.div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={18} />
                  <span>Chapter Videos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videos.length > 0 ? (
                  <div className="space-y-3">
                    {videos.map((video) => (
                      <motion.div
                        key={video.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedVideo?.id === video.id ? 'border-kiddo-purple' : 'border-gray-200'}`}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="flex gap-3 p-2">
                          <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{video.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{video.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    <p>No videos available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  {progressLoading ? (
                    <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                  ) : (
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 font-bold text-xl">
                      {userProgress ? userProgress.progress : 0}%
                    </div>
                  )}
                  <p className="mt-2 text-gray-600">
                    {!userProgress || userProgress.progress < 100 
                      ? "Keep going! You're making great progress." 
                      : "Great job! You've completed this chapter."}
                  </p>
                  
                  {/* Only show progress buttons for authenticated users */}
                  {userProgress !== null && (
                    <div className="mt-4 space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleProgressUpdate(Math.min(100, (userProgress?.progress || 0) + 25))}
                        disabled={updateProgressMutation.isPending || (userProgress?.progress || 0) >= 100}
                      >
                        Mark Progress
                      </Button>
                      
                      <Button
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleProgressUpdate(100)}
                        disabled={updateProgressMutation.isPending || (userProgress?.progress || 0) >= 100}
                      >
                        Complete Chapter
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChapterDetailPage;
