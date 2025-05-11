import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PrismicNextImage } from "@prismicio/next";
import { Calendar, Clock, Share2, X } from "lucide-react";
import { Content, ImageField } from "@prismicio/client";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: {
    post_thumbnail: ImageField;
    post_category: string;
    post_title: string;
    post_excerpt: string;
    post_date: string;
    reading_time: number;
    post_link: ImageField;
    author_name: string;
    author_image: ImageField;
    reading_progress?: number;
    post_content?: string;
  };
}

const BlogModal = ({ isOpen, onClose, blog }: BlogModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-5xl bg-[#14141e] shadow-2xl rounded-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors duration-200 group"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white" />
            </button>

            {/* Content Wrapper */}
            <div className="flex flex-col lg:flex-row max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)]">
              {/* Left Column - Image */}
              <motion.div
                variants={contentVariants}
                custom={0}
                className="relative w-full lg:w-1/2 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[600px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4f8fff]/20 to-transparent z-10" />
                <PrismicNextImage
                  field={blog.post_thumbnail}
                  fill
                  className="object-cover"
                  // alt={blog.post_title}
                />

                {/* Category Badge */}
                <motion.div
                  variants={contentVariants}
                  custom={1}
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20"
                >
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-[#4f8fff] bg-opacity-20 backdrop-blur-md text-white border border-[#4f8fff]/30 shadow-[0_0_20px_rgba(79,143,255,0.15)]">
                    {blog.post_category}
                  </span>
                </motion.div>
              </motion.div>

              {/* Right Column - Content */}
              <div className="relative w-full lg:w-1/2 overflow-y-auto modal-scroll">
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Title */}
                  <motion.h2
                    variants={contentVariants}
                    custom={2}
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4"
                  >
                    {blog.post_title}
                  </motion.h2>

                  {/* Author Info */}
                  <motion.div
                    variants={contentVariants}
                    custom={3}
                    className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm"
                  >
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                      <PrismicNextImage
                        field={blog.author_image}
                        className="rounded-lg object-cover"
                        fill
                        // alt={blog.author_name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm sm:text-base truncate">
                        {blog.author_name}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/60 flex-wrap">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#4f8fff]" />
                          {new Date(blog.post_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#4f8fff]" />
                          {blog.reading_time} min read
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    variants={contentVariants}
                    custom={4}
                    className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none mb-6 sm:mb-8"
                  >
                    <p className="text-white/80 leading-relaxed">
                      {blog.post_excerpt}
                    </p>
                    {blog.post_content && (
                      <div className="mt-4 sm:mt-6 text-white/70">
                        {blog.post_content}
                      </div>
                    )}
                  </motion.div>

                  {/* Share Button */}
                  <motion.div
                    variants={contentVariants}
                    custom={5}
                    className="flex justify-end pt-4 sm:pt-6 border-t border-white/10"
                  >
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#4f8fff]/10 hover:bg-[#4f8fff]/20 transition-colors"
                      onClick={() => {
                        if (blog.post_link?.url) {
                          navigator.clipboard.writeText(blog.post_link.url);
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#4f8fff]" />
                      <span className="text-white/80 text-sm sm:text-base">Share</span>
                    </button>
                  </motion.div>

                  {/* Reading Progress */}
                  {blog.reading_progress !== undefined && (
                    <motion.div
                      variants={contentVariants}
                      custom={6}
                      className="mt-4 sm:mt-6"
                    >
                      <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4f8fff] to-[#4f8fff]/70"
                          initial={{ width: "0%" }}
                          animate={{ width: `${blog.reading_progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BlogModal;


