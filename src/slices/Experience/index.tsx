"use client";
import { FC, useEffect, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ExperienceProps = SliceComponentProps<Content.ExperienceSlice>;

const Experience: FC<ExperienceProps> = ({ slice }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceType("mobile");
      else if (width < 1024) setDeviceType("tablet");
      else setDeviceType("desktop");
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      gsap.to(timelineRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      if (deviceType === "desktop") {
        const cards = document.querySelectorAll(".experience-card");
        cards.forEach((card, index) => {
          gsap.to(card, {
            y: index % 2 === 0 ? 30 : -30,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      }
    }
  }, [deviceType]);

  const isDesktop = deviceType === "desktop";
  const isMobile = deviceType === "mobile";

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-12 md:py-20 relative"
      data-slice-type="experience"
      data-slice-variation={slice.variation}
    >
      {/* Title Section */}
      <motion.div
        className="mb-10  pl-4 md:pl-8 relative z-30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 ">
          <span className="text-[#4f8fff] text-lg tracking-wider neon-text">
            02
          </span>
          <h2 className="text-2xl  font-bold text-white tracking-wider ">
            EXPERIENCE
          </h2>
        </div>
        <div className="w-32 h-0.5 mt-2 bg-[#4f8fff]  ml-9 neon-divider" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative">
        {/* Timeline Line */}
        <div
          className={`absolute ${
            isDesktop
              ? "left-1/2 -translate-x-[1px]"
              : "left-[21px] sm:left-[25px]"
          } top-0 bottom-0 w-[2px]`}
        >
          <div
            ref={timelineRef}
            className="w-full relative h-0"
            style={{
              background: `repeating-linear-gradient(180deg, #4f8fff 0%, #4f8fff 50%, transparent 50%, transparent 100%)`,
              backgroundSize: "4px 15px",
              boxShadow: "0 0 15px #4f8fff",
              opacity: 0.8,
            }}
          />
        </div>

        <div className="relative">
          {slice.primary.experiences.map((experience, index) => (
            <motion.div
              key={index}
              className={`flex items-start mb-12 md:mb-16 ${
                isDesktop
                  ? index % 2 === 0
                    ? "flex-row pr-8"
                    : "flex-row-reverse pl-8"
                  : "ml-8 sm:ml-12"
              }`}
              initial={{
                opacity: 0,
                x: isDesktop ? (index % 2 === 0 ? -50 : 50) : 20,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Timeline Node */}
              <div
                className={`absolute ${
                  isDesktop
                    ? "left-1/2 -translate-x-1/2"
                    : "md:-left-1.5 md:-translate-x-1/2 -translate-x-7/4"
                } z-10`}
              >
                <motion.div
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-[#14141e] border-2 border-[#4f8fff] flex items-center justify-center cursor-pointer relative"
                  whileHover={{ scale: isDesktop ? 1.2 : 1.1 }}
                  onClick={() =>
                    setActiveCard(activeCard === index ? null : index)
                  }
                >
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-[#4f8fff] shadow-[0_0_10px_#4f8fff] animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-[#4f8fff] opacity-20 animate-ping" />
                </motion.div>
              </div>

              {/* Experience Card */}
              <motion.div
                className={`experience-card ${
                  isDesktop ? "w-[calc(50%-2rem)]" : "w-[calc(100%-2rem)]"
                } p-4 sm:p-5 md:p-6 bg-[#14141e]/90 backdrop-blur-sm rounded-xl border border-[#252535] transition-all duration-300 ${
                  activeCard === index
                    ? "border-[#4f8fff] shadow-[0_0_20px_rgba(79,143,255,0.2)]"
                    : ""
                }`}
                whileHover={{
                  scale: isDesktop ? 1.02 : 1,
                  boxShadow: "0 0 30px rgba(79,143,255,0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">
                      {experience.title}
                    </h3>
                    <h4 className="text-[#4f8fff] text-sm md:text-base mb-1 font-mono">
                      {experience.company_name}
                    </h4>
                  </div>
                  <div className="text-[#aaaaaa] text-xs md:text-sm font-mono whitespace-nowrap">
                    {experience.start_date} - {experience.end_date}
                  </div>
                </div>
                <div className="border-t border-[#252535] mt-3 pt-3">
                  <h5 className="text-white text-sm md:text-base mb-2">
                    {experience.key_achievement} :
                  </h5>

                  <div className="text-[#cccccc] text-xs md:text-sm prose prose-invert">
                    <PrismicRichText field={experience.achievments} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
