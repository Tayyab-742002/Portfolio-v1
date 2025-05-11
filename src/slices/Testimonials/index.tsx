"use client";
import { FC, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials: FC<TestimonialsProps> = ({ slice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = slice.primary.testimonials;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="min-h-screen py-24 relative">
      {/* Section Header */}
      <motion.div
        className="mb-10  pl-4 md:pl-8 relative z-30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 ">
          <span className="text-[#4f8fff] text-lg tracking-wider neon-text">
            05
          </span>
          <h2 className="text-2xl  font-bold text-white tracking-wider ">
            TESTIMONIALS
          </h2>
        </div>
        <div className="w-32 h-0.5 mt-2 bg-[#4f8fff]  ml-9 neon-divider" />
      </motion.div>

      {/* Testimonials Carousel */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          <AnimatePresence mode="wait">
            <div key={currentIndex} className="relative">
              {/* Quote Symbol */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 0.3, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="absolute mt-10 -top-8 left-4"
              >
                <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                  <path d="M0,30 L20,0 L40,0 L20,30 Z" fill="#4f8fff" />
                </svg>
              </motion.div>

              {/* Testimonial Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="bg-[#14141e] border border-[#252535] rounded-xl p-8 mb-8"
              >
                <p className="text-white text-center text-lg mb-8 leading-relaxed">
                  {testimonials[currentIndex].comment}
                </p>
                <div className="text-center">
                  <h4 className="text-[#4f8fff] text-xl mb-2">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-[#aaaaaa]">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-[-3rem] left-0 right-0 flex items-center justify-center gap-5">
            <button
              onClick={goToPrev}
              className="w-6 h-6 cursor-pointer rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center hover:bg-[#252535] transition-colors"
              disabled={testimonials.length <= 1}
            >
              <svg width="12" height="12" viewBox="0 0 8 10" fill="#4f8fff">
                <path d="M7 1L1 5L7 9V1Z" fill="#4f8fff" />
              </svg>
            </button>

            {/* Enhanced Dots with colored lines */}
            <div className="flex items-center">
              {testimonials.map((_, index) => (
                <div key={index} className="flex items-center">
                  <motion.button
                    onClick={() => setCurrentIndex(index)}
                    className="relative w-2 h-2"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Outer ring */}
                    <div
                      className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                        index <= currentIndex
                          ? "bg-[#4f8fff] shadow-[0_0_10px_#4f8fff]"
                          : "bg-[#252535]"
                      }`}
                    />
                  </motion.button>
                  {index < testimonials.length - 1 && (
                    <div
                      className={`w-6 h-[2px] mx-1 transition-colors duration-300 ${
                        index < currentIndex ? "bg-[#4f8fff]" : "bg-[#252535]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-6 h-6 rounded-full cursor-pointer bg-[#14141e] border border-[#4f8fff] flex items-center justify-center hover:bg-[#252535] transition-colors"
              disabled={testimonials.length <= 1}
            >
              <svg width="12" height="12" viewBox="0 0 8 10" fill="#4f8fff">
                <path d="M1 1L7 5L1 9V1Z" fill="#4f8fff" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;





