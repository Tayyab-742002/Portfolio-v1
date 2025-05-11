import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PrismicNextImage } from "@prismicio/next";
import {
  X,
  Github,
  Globe,
  Play,
  ExternalLink,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    thumbnail: ImageField;
    title: string;
    description: string;
    live_link?: LinkField;
    github_link?: LinkField;
    demo_video?: {
      url: string;
    };
    long_description?: RichTextField;
  } | null;
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsPlaying(false);
      setShowShareOptions(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleShare = async () => {
    if (!project) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (error) {
      console.log("Error copying to clipboard:", error);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", duration: 0.5, bounce: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  if (!project) return null;

  const hasVideo = !!project.demo_video?.url;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-5xl bg-[#14141e]/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-[#252535] shadow-[0_0_50px_rgba(79,143,255,0.1)]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors duration-200 backdrop-blur-sm border border-white/10"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>

            <div
              className="flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(79, 143, 255, 0.3) #14141e",
              }}
            >
              {/* Demo Video */}
              {hasVideo && (
                <div className="relative w-full bg-black border-b border-[#252535]">
                  {!isPlaying ? (
                    <div className="relative aspect-video flex items-center justify-center bg-black/30">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="group flex items-center gap-3 px-6 py-3 rounded-full bg-[#4f8fff]/20 hover:bg-[#4f8fff]/30 backdrop-blur-sm border border-[#4f8fff]/30 transition-all duration-300 hover:scale-105 z-10"
                      >
                        <Play className="w-6 h-6 text-[#4f8fff]" />
                        <span className="text-white font-medium">
                          Watch Demo
                        </span>
                      </button>
                      {/* Display thumbnail as background when video is not playing */}
                      <div className="absolute inset-0">
                        <PrismicNextImage
                          field={project.thumbnail}
                          fill
                          className="object-cover opacity-50"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <video
                        src={project.demo_video?.url}
                        controls
                        className="w-full"
                        autoPlay
                        playsInline
                        controlsList="nodownload"
                        webkit-playsinline="true"
                        preload="auto"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              )}

              {/* Hero Section */}
              {!hasVideo && (
                <div className="relative w-full h-[300px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#14141e] z-10" />
                  <PrismicNextImage
                    field={project.thumbnail}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Title and Action Buttons */}
              <div className="p-6">
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  {project.title}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.live_link &&
                    project.live_link.link_type !== "Any" && (
                      <a
                        href={project.live_link.url || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4f8fff] hover:bg-[#4f8fff]/90 transition-all duration-300 group"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          Visit Website
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </a>
                    )}
                  {project.github_link &&
                    project.github_link.link_type !== "Any" && (
                      <a
                        href={project.github_link.url || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#252535] hover:bg-[#252535]/90 transition-all duration-300 group border border-[#4f8fff]/20"
                      >
                        <Github className="w-4 h-4" />
                        <span className="font-medium text-sm">View Code</span>
                        <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </a>
                    )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#252535] hover:bg-[#252535]/90 transition-all duration-300 group border border-[#4f8fff]/20 relative"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="font-medium text-sm">Share</span>
                    {showShareOptions && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#252535] rounded-lg shadow-lg border border-[#4f8fff]/20 overflow-hidden">
                        <button
                          onClick={copyToClipboard}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#4f8fff]/10 transition-colors"
                        >
                          <LinkIcon className="w-4 h-4" />
                          <span className="text-sm">Copy Link</span>
                        </button>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-6 py-8">
                <div className="space-y-6">
                  {/* Description */}
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div className="text-lg text-white/80 leading-relaxed">
                      {project.description}
                    </div>
                    {project.long_description && (
                      <div className="mt-4">
                        <PrismicRichText field={project.long_description} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
