"use client";

import React, { useState, useRef, useEffect } from "react";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogSlice } from "./types";
import gsap from "gsap";
import BlogModal from "@/components/BlogModal";

export type BlogProps = SliceComponentProps<BlogSlice>;

const Blog = ({ slice }: BlogProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<
    (typeof slice.items)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slice.items.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + slice.items.length) % slice.items.length
    );
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setIsSwiping(false);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
  };

  // GSAP animations for card hover effects
  useEffect(() => {
    if (cardRefs.current.length > 0) {
      const activeCard = cardRefs.current[1]; // Center card
      if (activeCard) {
        activeCard.addEventListener("mouseenter", () => {
          gsap.to(activeCard, {
            duration: 0.4,
            y: -10,
            scale: 1.05,
            boxShadow:
              "0 20px 25px -5px rgba(79, 143, 255, 0.1), 0 10px 10px -5px rgba(79, 143, 255, 0.04)",
            ease: "power2.out",
          });
        });

        activeCard.addEventListener("mouseleave", () => {
          gsap.to(activeCard, {
            duration: 0.4,
            y: 0,
            scale: 1,
            boxShadow: "none",
            ease: "power2.out",
          });
        });
      }
    }
  }, [slice.items, activeIndex]);

  const handleBlogClick = (blog: (typeof slice.items)[0]) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  return (
    <section className="py-20 overflow-hidden" data-slice-type="blog">
      <div className="min-h-screen relative overflow-hidden">
        <div className="relative h-full pl-4 md:pl-8">
          <motion.div
            className="mb-10  pl-4 md:pl-8 relative z-30"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 ">
              <span className="text-[#4f8fff] text-lg tracking-wider neon-text">
                06
              </span>
              <h2 className="text-2xl  font-bold text-white tracking-wider ">
                BLOGS
              </h2>
            </div>
            <div className="w-32 h-0.5 mt-2 bg-[#4f8fff]  ml-9 neon-divider" />
          </motion.div>

          {/* Carousel Container */}
          <div className="relative mx-auto max-w-7xl h-[420px] mb-12 flex items-center justify-center">
            <div
              ref={carouselRef}
              className="relative h-full flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {slice.items.map((item, index) => {
                  const isActive = index === activeIndex;
                  const position =
                    index === activeIndex
                      ? "center"
                      : index ===
                          (activeIndex - 1 + slice.items.length) %
                            slice.items.length
                        ? "left"
                        : index === (activeIndex + 1) % slice.items.length
                          ? "right"
                          : index < activeIndex
                            ? "far-left"
                            : "far-right";

                  const xPosition = {
                    "far-left": isMobile ? "-120px" : "-450px",
                    left: isMobile ? "-70px" : "-220px",
                    center: "0px",
                    right: isMobile ? "70px" : "220px",
                    "far-right": isMobile ? "120px" : "450px",
                  }[position];

                  const opacity = {
                    "far-left": 0,
                    left: 0.6,
                    center: 1,
                    right: 0.6,
                    "far-right": 0,
                  }[position];

                  const scale = {
                    "far-left": 0.7,
                    left: 0.85,
                    center: 1,
                    right: 0.85,
                    "far-right": 0.7,
                  }[position];

                  return (
                    <motion.div
                      key={index}
                      ref={(el: any) => (cardRefs.current[index] = el)}
                      className="absolute transform -translate-x-1/2 left-1/2"
                      style={{
                        cursor: isActive ? "pointer" : "default",
                        pointerEvents: ["left", "center", "right"].includes(
                          position
                        )
                          ? "auto"
                          : "none",
                        visibility: ["left", "center", "right"].includes(
                          position
                        )
                          ? "visible"
                          : "hidden",
                        zIndex:
                          position === "center"
                            ? 30
                            : position === "left"
                              ? 20
                              : position === "right"
                                ? 20
                                : 10,
                      }}
                      onClick={() => {
                        if (isActive) {
                          handleBlogClick(item);
                        } else if (
                          ["left", "center", "right"].includes(position)
                        ) {
                          if (position === "left") {
                            prevSlide();
                          } else if (position === "right") {
                            nextSlide();
                          }
                        }
                      }}
                      initial={false}
                      animate={{
                        x: xPosition,
                        opacity: opacity,
                        scale: scale,
                        rotateY:
                          position === "left"
                            ? 15
                            : position === "right"
                              ? -15
                              : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 35,
                        mass: 1,
                        opacity: { duration: 0.5, ease: "easeInOut" },
                        scale: { duration: 0.5, ease: "easeInOut" },
                        rotateY: { duration: 0.7, ease: "easeInOut" },
                      }}
                      whileHover={{
                        scale: isActive ? 1.05 : scale,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                    >
                      {/* Blog Card */}
                      <motion.div
                        className="group relative w-[300px] h-[400px] bg-[#14141e] rounded-2xl overflow-hidden cursor-pointer"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {/* Image Container - Adjusted height */}
                        <div className="relative w-full h-[180px] overflow-hidden">
                          <PrismicNextImage
                            field={item.post_thumbnail}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                            // alt={item.post_title || ""}
                          />
                          {/* Category Tag */}
                          <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#4f8fff] rounded-full">
                            <span className="text-xs font-medium text-white">
                              {item.post_category}
                            </span>
                          </div>
                        </div>

                        {/* Content Container */}
                        <div className="p-5 space-y-3">
                          {/* Title */}
                          <h3 className="text-lg font-semibold text-white group-hover:text-[#4f8fff] transition-colors duration-300 line-clamp-2">
                            {item.post_title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-sm text-gray-400 line-clamp-3">
                            {item.post_excerpt}
                          </p>

                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-[#4f8fff]" />
                              <span>{item.reading_time} min read</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-[#4f8fff]" />
                              <span>
                                {new Date(item.post_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Author Section */}
                          <div className="flex items-center gap-3 pt-3 mt-3 border-t border-gray-800">
                            <div className="relative w-9 h-9 rounded-full overflow-hidden">
                              <PrismicNextImage
                                field={item.author_image}
                                fill
                                className="object-cover"
                                // alt={item.author_name || ""}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium truncate">
                                {item.author_name}
                              </p>
                              {/* <p className="text-xs text-gray-400 truncate">
                                {item.author_role}
                              </p> */}
                            </div>

                            {/* Read More Button */}
                            <motion.div
                              className="flex items-center gap-1.5 text-sm text-[#4f8fff] font-medium"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              Read More
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 border-2 border-[#4f8fff] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-[-3rem] left-0 right-0 flex items-center justify-center gap-5">
              <button
                onClick={prevSlide}
                className="w-6 h-6 cursor-pointer rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center hover:bg-[#252535] transition-colors"
                disabled={slice.items.length <= 1}
              >
                <svg width="12" height="12" viewBox="0 0 8 10" fill="#4f8fff">
                  <path d="M7 1L1 5L7 9V1Z" fill="#4f8fff" />
                </svg>
              </button>

              {/* Dots Navigation */}
              <div className="flex items-center">
                {slice.items.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <motion.button
                      onClick={() => setActiveIndex(index)}
                      className="relative w-2 h-2"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                          index <= activeIndex
                            ? "bg-[#4f8fff] shadow-[0_0_10px_#4f8fff]"
                            : "bg-[#252535]"
                        }`}
                      />
                    </motion.button>
                    {index < slice.items.length - 1 && (
                      <div
                        className={`w-6 h-[2px] mx-1 transition-colors duration-300 ${
                          index < activeIndex ? "bg-[#4f8fff]" : "bg-[#252535]"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-6 h-6 rounded-full cursor-pointer bg-[#14141e] border border-[#4f8fff] flex items-center justify-center hover:bg-[#252535] transition-colors"
                disabled={slice.items.length <= 1}
              >
                <svg width="12" height="12" viewBox="0 0 8 10" fill="#4f8fff">
                  <path d="M1 1L7 5L1 9V1Z" fill="#4f8fff" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add the modal */}
      {selectedBlog && (
        <BlogModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          blog={selectedBlog as any}
        />
      )}
    </section>
  );
};

export default Blog;
