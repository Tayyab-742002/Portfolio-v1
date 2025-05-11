"use client";
import { FC, useEffect, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { PrismicNextImage } from "@prismicio/next";

gsap.registerPlugin(ScrollTrigger);

export type AboutMeProps = SliceComponentProps<Content.AboutMeSlice>;

const optimizedAnimation = {
  willChange: "transform",
  backfaceVisibility: "hidden",
  perspective: 1000,
  transform: "translateZ(0)",
};

const AboutMe: FC<AboutMeProps> = ({ slice }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const journeyCardRef = useRef<HTMLDivElement>(null);
  const techCardRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (
      sectionRef.current &&
      profileCardRef.current &&
      journeyCardRef.current &&
      techCardRef.current
    ) {
      const cards = [
        profileCardRef.current,
        journeyCardRef.current,
        techCardRef.current,
      ];

      cards.forEach((card) => {
        gsap.to(card, {
          x: `+=${gsap.utils.random(-3, 3)}`,
          y: `+=${gsap.utils.random(-3, 3)}`,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1.5,
          },
          ease: "power1.out",
        });
      });

      const glitchInterval = setInterval(() => {
        if (glitchRef.current) {
          gsap.to(glitchRef.current, {
            duration: 0.15,
            x: gsap.utils.random(-1, 1),
            y: gsap.utils.random(-1, 1),
            scale: 1.01,
            repeat: 1,
            yoyo: true,
            ease: "none",
            ...optimizedAnimation,
          });
        }
      }, 4000);

      return () => {
        window.removeEventListener("resize", checkMobile);
        clearInterval(glitchInterval);
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, []);

  const handleCardInteraction = (index: number) => {
    isMobile && setActiveCard(activeCard === index ? null : index);
  };

  const cardProps = (index: number) => ({
    initial: { scale: 0.9, opacity: 0.5 },
    animate: {
      scale: activeCard === index || !isMobile ? 1 : 0.9,
      opacity: activeCard === index || !isMobile ? 1 : 0.7,
      zIndex: activeCard === index ? 40 : 10 + index * 10,
    },
    transition: { type: "spring", stiffness: 300 },
    onHoverStart: () => !isMobile && setActiveCard(index),
    onHoverEnd: () => !isMobile && setActiveCard(null),
    onClick: () => handleCardInteraction(index),
  });

  return (
    <section
      ref={sectionRef}
      data-slice-type="about_me"
      className="min-h-screen relative overflow-hidden"
    >
      <div className="relative h-full">
        <motion.div
          className="pl-4 mb-10 md:pl-8 relative z-30"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 ">
            <span className="text-[#4f8fff] text-lg tracking-wider neon-text">
              01
            </span>
            <h2 className="text-2xl  font-bold text-white tracking-wider ">
              ABOUT ME
            </h2>
          </div>
          <div className="w-32 h-0.5 mt-2 bg-[#4f8fff]  ml-9 neon-divider" />
        </motion.div>

        {/* Desktop View */}
        <div className="hidden lg:block relative h-[700px] mx-auto ">
          {/* Profile Card */}
          <motion.div
            {...cardProps(0)}
            ref={profileCardRef}
            className="parallax-card absolute  left-[25%] top-24 w-[300px] h-[400px] bg-[#14141e] flex flex-col items-center justify-between border border-[#4f8fff]/20 rounded-2xl p-6 cursor-pointer"
          >
            <div className="relative w-32 h-32 rounded-xl overflow-hidden">
              <div
                ref={glitchRef}
                className="glitch-photo absolute inset-0 bg-gray-700 rounded-xl flex items-center justify-center text-[#4f8fff] text-sm tracking-wider"
                style={{
                  transform: "translate(0)",
                  transformOrigin: "center",
                  willChange: "transform",
                }}
              >
                <PrismicNextImage
                  field={slice.primary.avatar}
                  className="w-full h-full object-cover"
                  // alt="Profile avatar"
                />
              </div>
            </div>

            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  className="stroke-[#252535] stroke-[8] fill-none"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  className="stroke-[#4f8fff] stroke-[8] fill-none"
                  strokeDasharray="377"
                  strokeDashoffset="38"
                />
              </svg>
              {slice.primary.techareas.map((item) => (
                <div
                  key={item.title}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <span className="text-[#4f8fff] text-md">{item.title}</span>
                  <span className="text-white text-md font-bold">
                    {item.percentage}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Journey Card */}
          <motion.div
            {...cardProps(1)}
            ref={journeyCardRef}
            className="parallax-card absolute left-[38%] top-36 w-[300px] h-[400px] bg-[#14141e]/90 backdrop-blur-xl border border-[#4f8fff]/20 rounded-2xl p-6 cursor-pointer"
          >
            <h3 className="text-lg font-bold text-white mb-6 tracking-wider">
              {slice.primary.my_journey}
            </h3>
            <motion.div
              className="relative h-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <p className="text-[#cccccc] text-sm leading-relaxed">
                {slice.primary.journey_detail}
              </p>
            </motion.div>

            <div className="flex gap-4 justify-center mt-8">
              {slice.primary.tags.map((skill, index) => {
                if (index < 3) {
                  return (
                    <motion.div
                      key={skill.tag_name}
                      className="skill-orb w-16 h-16 rounded-full bg-[#14141e] border border-[#4f8fff]/30 flex items-center justify-center group cursor-pointer"
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 20px rgba(79, 143, 255, 0.3)",
                      }}
                    >
                      <span className="text-[#4f8fff] text-xs group-hover:text-white transition-colors">
                        {skill.tag_name}
                      </span>
                    </motion.div>
                  );
                }
              })}
            </div>
          </motion.div>

          {/* Tech Stack Card */}
          <motion.div
            {...cardProps(2)}
            ref={techCardRef}
            className="parallax-card absolute left-[50%] top-48 w-[300px] h-[400px] bg-[#14141e]/90 backdrop-blur-xl border border-[#4f8fff]/20 rounded-2xl p-6 cursor-pointer overflow-hidden"
          >
            <h3 className="text-2xl font-bold text-white mb-8 tracking-wider">
              {slice.primary.tech_expertise}
            </h3>
            <div className="flex flex-col items-center">
              {slice.primary.tech_skills.map((tech, index) => (
                <motion.div
                  key={tech.skill}
                  className="w-full tech-layer"
                  whileHover={{ scale: 1.02 }}
                  style={{ width: `${100 - index * 8}%` }}
                >
                  <div className="tech-stack-item text-center bg-[#14141e] border border-[#4f8fff] p-2 hover:bg-[#4f8fff]/10 transition-all duration-300">
                    <span className="text-white text-center text-sm">
                      {tech.skill}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex flex-col gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[300px] mx-auto bg-[#14141e] flex flex-col items-center justify-between border border-[#4f8fff]/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="relative w-28 h-28 rounded-xl overflow-hidden mb-4">
              <div className="glitch-photo absolute inset-0 bg-gray-700 rounded-xl flex items-center justify-center text-[#4f8fff] text-sm tracking-wider">
                <PrismicNextImage
                  field={slice.primary.avatar}
                  className="w-full h-full object-cover"
                  // alt="Profile avatar"
                />
              </div>
            </div>

            <div className="relative w-32 h-32 mt-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="stroke-[#252535] stroke-[8] fill-none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="stroke-[#4f8fff] stroke-[8] fill-none"
                  strokeDasharray="314"
                  strokeDashoffset="31"
                />
              </svg>
              {slice.primary.techareas.map((item) => (
                <div
                  key={item.title}
                  className="absolute inset-0 top-5 flex flex-col items-center justify-center"
                >
                  <span className="text-[#4f8fff] text-[12px]">
                    {item.title}
                  </span>
                  <span className="text-white text-[12px] font-bold">
                    {item.percentage}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Journey Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-[300px] mx-auto bg-[#14141e]/90 backdrop-blur-xl border border-[#4f8fff]/20 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-white mb-4 tracking-wider">
              {slice.primary.my_journey}
            </h3>
            <div className="mb-6">
              <p className="text-[#cccccc] text-sm leading-relaxed">
                {slice.primary.journey_detail}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {slice.primary.tags.map((skill, index) => {
                if (index < 3) {
                  return (
                    <motion.div
                      key={skill.tag_name}
                      className="skill-orb w-16 h-16 rounded-full bg-[#14141e] border border-[#4f8fff]/30 flex items-center justify-center"
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-[#4f8fff] text-xs">
                        {skill.tag_name}
                      </span>
                    </motion.div>
                  );
                }
              })}
            </div>
          </motion.div>

          {/* Tech Stack Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-[300px] mx-auto bg-[#14141e]/90 backdrop-blur-xl border border-[#4f8fff]/20 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-white mb-6 tracking-wider">
              {slice.primary.tech_expertise}
            </h3>
            <div className="flex flex-col items-center gap-3">
              {slice.primary.tech_skills.map((tech, index) => (
                <motion.div
                  key={tech.skill}
                  className="w-full tech-layer"
                  whileTap={{ scale: 0.98 }}
                  style={{ width: `${100 - index * 6}%` }}
                >
                  <div className="tech-stack-item bg-[#14141e] border border-[#4f8fff]/30 p-2 rounded-lg transition-all duration-300">
                    <span className="text-white text-sm">{tech.skill}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .glitch-photo {
          position: relative;
          animation: glitch 2s infinite linear;
          transform-origin: center;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          2% {
            transform: translate(2px, 0) skew(0deg);
            filter: hue-rotate(0deg);
          }
          4% {
            transform: translate(-2px, 0) skew(0deg);
            filter: hue-rotate(0deg);
          }
          6% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          8% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          12% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          14% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          16% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          18% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          20% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          22% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          24% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          26% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          28% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          30% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          32% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          34% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          36% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          38% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          40% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          42% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          44% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          46% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          48% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          52% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          54% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          56% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          58% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          60% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          62% {
            transform: translate(0, 0) skew(5deg);
            filter: hue-rotate(0deg);
          }
          64% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          66% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          68% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          70% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          72% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          74% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          76% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          78% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          80% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          82% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          84% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          86% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          88% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          90% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          92% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          94% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          96% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          98% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
        }

        .parallax-card {
          transition: all 0.3s ease-in-out;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .parallax-card:hover {
          box-shadow: 0 12px 40px rgba(79, 143, 255, 0.2);
        }

        @media (hover: hover) and (pointer: fine) {
          .parallax-card {
            transition:
              transform 0.3s,
              opacity 0.3s,
              box-shadow 0.3s;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutMe;
