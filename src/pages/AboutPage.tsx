
import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, GraduationCap, Users, Smile, Heart, Info } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="kiddo-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-kiddo-blue to-kiddo-purple text-transparent bg-clip-text mb-4">
            About Kiddo Class Adventures
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Making learning fun, interactive and accessible for children around the world.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-2 border-kiddo-yellow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-kiddo-blue flex items-center justify-center gap-2">
                <Info size={28} className="text-kiddo-purple" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg">
                At Kiddo Class Adventures, we believe that learning should be an exciting journey. 
                Our mission is to transform education through interactive, engaging, and fun learning 
                experiences that inspire curiosity and foster a lifelong love of learning.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <BookOpen size={24} className="text-kiddo-purple" />
            What Makes Us Special
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Interactive Learning",
                description: "Engaging activities that make learning fun and memorable",
                icon: <GraduationCap size={40} className="text-kiddo-blue" />,
                color: "border-kiddo-blue"
              },
              {
                title: "Comprehensive Curriculum",
                description: "Covering all major subjects with age-appropriate content",
                icon: <Book size={40} className="text-kiddo-purple" />,
                color: "border-kiddo-purple"
              },
              {
                title: "Child-Centered Approach",
                description: "Designed with children's needs and learning styles in mind",
                icon: <Smile size={40} className="text-kiddo-yellow" />,
                color: "border-kiddo-yellow"
              },
              {
                title: "Progress Tracking",
                description: "Monitor your child's learning journey and celebrate achievements",
                icon: <Heart size={40} className="text-red-500" />,
                color: "border-red-400"
              },
              {
                title: "Expert Educators",
                description: "Content created by experienced teachers and education specialists",
                icon: <Users size={40} className="text-green-500" />,
                color: "border-green-400"
              },
              {
                title: "Accessible Anytime",
                description: "Learn at your own pace, whenever and wherever works best",
                icon: <BookOpen size={40} className="text-amber-500" />,
                color: "border-amber-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                <Card className={`kiddo-card h-full ${feature.color} hover:shadow-lg`}>
                  <CardContent className="pt-6 text-center">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      className="mb-4 inline-block"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="border-2 border-kiddo-purple">
            <CardHeader>
              <CardTitle className="text-2xl text-kiddo-blue flex items-center gap-2">
                <Book size={24} className="text-kiddo-purple" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Kiddo Class Adventures was founded in 2023 by a team of passionate educators and 
                technology experts who saw the need for more engaging educational content for children.
              </p>
              <p className="mb-4">
                We started with a simple question: "How can we make learning as exciting as playing?" 
                This question led us to develop an educational platform that combines academic excellence 
                with playful interaction, colorful visuals, and rewarding experiences.
              </p>
              <p>
                Today, we're proud to offer a comprehensive educational solution that children love to use
                and parents trust. Our growing community of young learners continues to inspire us to 
                innovate and expand our offerings.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Join Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Join Our Adventure!</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Start your child's learning journey with Kiddo Class Adventures today 
            and watch them grow into curious, confident learners.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="kiddo-button bg-gradient-to-r from-kiddo-purple to-kiddo-blue"
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AboutPage;
