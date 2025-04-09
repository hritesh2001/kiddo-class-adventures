
import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Download, Share2 } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Mock data for videos
const getChapterVideos = (subjectId: string, chapterId: number) => {
  // This would come from your backend in a real app
  return [
    {
      id: 1,
      title: `${getSubjectName(subjectId)} - Lesson ${chapterId}.1`,
      description: "Introduction to the basic concepts",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnail: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
      duration: "4:12"
    },
    {
      id: 2,
      title: `${getSubjectName(subjectId)} - Lesson ${chapterId}.2`,
      description: "Interactive examples and exercises",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnail: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
      duration: "3:45"
    },
    {
      id: 3,
      title: `${getSubjectName(subjectId)} - Lesson ${chapterId}.3`,
      description: "Practice problems and applications",
      videoUrl: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
      thumbnail: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
      duration: "5:20"
    }
  ];
};

// Helper function to get subject name
function getSubjectName(subjectId: string): string {
  const subjects: Record<string, string> = {
    "math": "Mathematics",
    "english": "English",
    "science": "Science",
    "social": "Social Studies",
    "arts": "Arts & Crafts",
    "computer": "Computer"
  };
  
  return subjects[subjectId as keyof typeof subjects] || "Subject";
}

// Helper function to get chapter title
function getChapterTitle(subjectId: string, chapterNum: number): string {
  const titles: Record<string, string[]> = {
    "math": [
      "Numbers and Counting",
      "Addition and Subtraction",
      "Shapes and Patterns",
      "Measurement",
      "Time and Money",
      "Multiplication Basics",
      "Division Basics",
      "Fractions Introduction"
    ],
    "english": [
      "Alphabet and Phonics",
      "Word Recognition",
      "Simple Sentences",
      "Reading Comprehension",
      "Storytelling",
      "Grammar Basics",
      "Writing Skills",
      "Poetry and Rhymes",
      "Speaking Skills",
      "Listening Skills"
    ],
    "science": [
      "Living Things",
      "Plants and Animals",
      "Human Body",
      "Materials and Matter",
      "Earth and Space",
      "Forces and Energy"
    ],
    "social": [
      "My Family",
      "Our Community",
      "Our Country",
      "World Around Us",
      "History and Culture"
    ],
    "arts": [
      "Colors and Painting",
      "Drawing and Sketching",
      "Crafts and Creations",
      "Music and Rhythm"
    ],
    "computer": [
      "Introduction to Computers",
      "Keyboard and Mouse",
      "Basic Software",
      "Internet Safety",
      "Digital Art"
    ]
  };
  
  const subjectTitles = titles[subjectId] || titles.math;
  return subjectTitles[chapterNum - 1] || `Learning Module ${chapterNum}`;
}

const ChapterDetailPage = () => {
  const { classId, subjectId, chapterId } = useParams<{ 
    classId: string;
    subjectId: string;
    chapterId: string;
  }>();
  const isMobile = useIsMobile();
  
  const classNum = parseInt(classId || "1");
  const chapterNum = parseInt(chapterId || "1");
  const chapterTitle = getChapterTitle(subjectId || "math", chapterNum);
  const subjectName = getSubjectName(subjectId || "math");
  
  // Get videos for this chapter
  const videos = getChapterVideos(subjectId || "math", chapterNum);
  const [selectedVideo, setSelectedVideo] = React.useState(videos[0]);
  
  const downloadVideo = () => {
    toast({
      title: "Download started",
      description: "Your video is being downloaded...",
    });
  };
  
  const shareContent = () => {
    toast({
      title: "Share",
      description: "Sharing functionality will be implemented soon!",
    });
  };
  
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
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Chapter {chapterNum}: {chapterTitle}
                </h1>
                <p className="text-gray-600">
                  {subjectName} • Class {classNum}
                </p>
              </div>
              
              <VideoPlayer 
                src={selectedVideo.videoUrl} 
                poster={selectedVideo.thumbnail}
              />
              
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
                  In this chapter, students will learn about {chapterTitle.toLowerCase()} through interactive videos, 
                  engaging activities, and fun exercises. The content is designed to make learning enjoyable while 
                  building a strong foundation in {subjectName.toLowerCase()}.
                </p>
              </div>
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
                <div className="space-y-3">
                  {videos.map((video) => (
                    <motion.div
                      key={video.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedVideo.id === video.id ? 'border-kiddo-purple' : 'border-gray-200'}`}
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
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 font-bold text-xl">
                    33%
                  </div>
                  <p className="mt-2 text-gray-600">Keep going! You're making great progress.</p>
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
