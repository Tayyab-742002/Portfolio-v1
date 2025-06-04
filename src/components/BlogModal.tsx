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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
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
            className="relative w-full max-w-3xl bg-[#14141e] shadow-2xl rounded-2xl overflow-hidden max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-1.5 sm:p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors duration-200 group"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white" />
            </button>

            {/* Content Wrapper - Now in column layout */}
            <div className="flex flex-col max-h-[90vh] overflow-hidden">
              {/* Top - Image */}
              <motion.div
                variants={contentVariants}
                custom={0}
                className="relative w-full h-[180px] sm:h-[250px] md:h-[300px]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#4f8fff]/20 to-transparent z-10" />
                <PrismicNextImage
                  field={blog.post_thumbnail}
                  fill
                  className="object-cover"
                />

                {/* Category Badge */}
                <motion.div
                  variants={contentVariants}
                  custom={1}
                  className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20"
                >
                  <span className="px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-[#4f8fff] bg-opacity-20 backdrop-blur-md text-white border border-[#4f8fff]/30 shadow-[0_0_20px_rgba(79,143,255,0.15)]">
                    {blog.post_category}
                  </span>
                </motion.div>
              </motion.div>

              {/* Bottom - Content */}
              <div className="relative w-full overflow-y-auto modal-scroll max-h-[calc(90vh-180px)] sm:max-h-[calc(90vh-250px)] md:max-h-[calc(90vh-300px)]">
                <div className="p-3 sm:p-5 lg:p-6">
                  {/* Title */}
                  <motion.h2
                    variants={contentVariants}
                    custom={2}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4"
                  >
                    {blog.post_title}
                  </motion.h2>

                  {/* Author Info */}
                  <motion.div
                    variants={contentVariants}
                    custom={3}
                    className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-5 p-2 sm:p-3 lg:p-4 rounded-xl bg-white/5 backdrop-blur-sm"
                  >
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                      <PrismicNextImage
                        field={blog.author_image}
                        className="rounded-lg object-cover"
                        fill
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-xs sm:text-sm lg:text-base truncate">
                        {blog.author_name}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/60 flex-wrap">
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
                    className="prose prose-invert prose-sm max-w-none mb-4 sm:mb-6"
                  >
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                      {blog.post_excerpt}
                    </p>
                    {blog.post_content && (
                      <div className="mt-3 sm:mt-5 text-xs sm:text-sm lg:text-base text-white/70">
                        {blog.post_content}
                      </div>
                    )}
                  </motion.div>

                  {/* Share Button */}
                  <motion.div
                    variants={contentVariants}
                    custom={5}
                    className="flex justify-end pt-3 sm:pt-4 border-t border-white/10"
                  >
                    <button
                      className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-lg bg-[#4f8fff]/10 hover:bg-[#4f8fff]/20 transition-colors"
                      onClick={() => {
                        if (blog.post_link?.url) {
                          navigator.clipboard.writeText(blog.post_link.url);
                        }
                      }}
                    >
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#4f8fff]" />
                      <span className="text-white/80 text-xs sm:text-sm lg:text-base">Share</span>
                    </button>
                  </motion.div>

                  {/* Reading Progress */}
                  {blog.reading_progress !== undefined && (
                    <motion.div
                      variants={contentVariants}
                      custom={6}
                      className="mt-3 sm:mt-5"
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


