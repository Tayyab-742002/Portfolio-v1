"use client";
import { FC, useEffect, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";
import { Github, Globe } from "lucide-react";
import ProjectModal from "@/components/ProjectModal";

/**
 * Props for `Projects`.
 */
export type ProjectsProps = SliceComponentProps<Content.ProjectsSlice>;

/**
 * Component for "Projects" Slices.
 */
const Projects: FC<ProjectsProps> = ({ slice }) => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeIndex, setActiveIndex] = useState(0);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [touchStart, setTouchStart] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const webglRef = useRef<HTMLDivElement>(null);
  function extractTechnologies(project: any) {
    if (!project.technologies || !Array.isArray(project.technologies)) {
      return [];
    }

    // Find the first paragraph that contains the technologies text
    const techParagraph = project.technologies.find(
      (item: any) => item.type === "paragraph"
    );
    if (!techParagraph || !techParagraph.text) {
      return [];
    }

    // Split the text by '|' and trim each technology
    return techParagraph.text.split("|").map((tech: any) => tech.trim());
  }

  const filters = ["ALL", "WEB", "MOBILE", "AI"];

  // Add this useEffect for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Process projects data and handle technologies properly
  useEffect(() => {
    if (!slice.primary.projects) {
      setFilteredProjects([]);
      return;
    }

    const processProjects = () => {
      return (slice.primary.projects || []).map((project: any) => {
        // Handle technologies - assuming it could be a string like "React | Node | OpenAI"
        let techArray = [];

        if (project.technologies) {
          if (typeof project.technologies === "string") {
            // Split by pipe or comma and create array of objects
            techArray = project.technologies
              .split(/\s*[\|,]\s*/)
              .map((tech: string) => ({
                text: tech.trim(),
              }));
          } else if (Array.isArray(project.technologies)) {
            // Ensure each item has a text property
            techArray = project.technologies.map((tech: any) => {
              if (typeof tech === "string") {
                return { text: tech };
              } else if (tech && tech.text) {
                return tech;
              }
              return { text: String(tech) };
            });
          }
        }

        return {
          ...project,
          technologies: techArray,
          category: project.category || "WEB", // Default to WEB if no category is set
        };
      });
    };

    const processedProjects = processProjects();

    if (activeFilter === "ALL") {
      setFilteredProjects(processedProjects);
    } else {
      const filtered = processedProjects.filter(
        (project) =>
          project.category && project.category.toUpperCase() === activeFilter
      );
      setFilteredProjects(filtered);
    }

    // Reset to first card when changing filters
    setActiveIndex(0);
  }, [activeFilter, slice.primary.projects]);

  // Initialize THREE.js for WebGL effects on center card
  useEffect(() => {
    if (webglRef.current && filteredProjects.length > 0) {
      const setup3DEffect = (element: HTMLDivElement) => {
        const width = element.clientWidth;
        const height = element.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          0.1,
          1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);
        element.innerHTML = "";
        element.appendChild(renderer.domElement);

        // Create a floating plane with shader material
        const geometry = new THREE.PlaneGeometry(5, 3, 10, 10);
        const material = new THREE.MeshBasicMaterial({
          color: "#4f8fff",
          transparent: true,
          opacity: 0.15,
          wireframe: true,
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          plane.rotation.x += 0.002;
          plane.rotation.y += 0.001;
          renderer.render(scene, camera);
        };

        animate();

        // Add resize event listener
        const handleResize = () => {
          const newWidth = element.clientWidth;
          const newHeight = element.clientHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener("resize", handleResize);

        // Return cleanup function
        return () => {
          window.removeEventListener("resize", handleResize);
          if (element.contains(renderer.domElement)) {
            element.removeChild(renderer.domElement);
          }
        };
      };

      const cleanup = setup3DEffect(webglRef.current);
      return cleanup;
    }
  }, [filteredProjects, activeIndex]);

  // GSAP animations for card hover effects
  useEffect(() => {
    if (cardRefs.current.length > 0) {
      const activeCard = cardRefs.current[1]; // Center card
      if (activeCard) {
        // Create hover animation with GSAP
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
  }, [filteredProjects, activeIndex]);

  // Navigation functions
  const goToNext = () => {
    if (filteredProjects.length <= 1) return;
    setActiveIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length);
  };

  const goToPrev = () => {
    if (filteredProjects.length <= 1) return;
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? filteredProjects.length - 1 : prevIndex - 1
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
        goToNext();
      } else {
        goToPrev();
      }
      setIsSwiping(false);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
  };

  return (
    <section
      className="py-16 md:py-20 lg:py-24 relative"
      data-slice-type="projects"
      id="projects"
    >
      <div className="container mx-auto px-4">
        {/* Section Header with Animation */}
        <motion.div
          className="mb-10  pl-4 md:pl-8 relative z-30"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 ">
            <span className="text-[#4f8fff] text-lg tracking-wider neon-text">
              03
            </span>
            <h2 className="text-2xl  font-bold text-white tracking-wider ">
              PROJECTS
            </h2>
          </div>
          <div className="w-32 h-0.5 mt-2 bg-[#4f8fff]  ml-9 neon-divider" />
        </motion.div>

        {/* Filter System with Animation */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex space-x-4 flex-wrap justify-center">
            {filters.map((filter, index) => (
              <motion.button
                key={filter}
                className={`rounded-full text-xs px-4 py-0.5 lg:px-4 lg:py-1 lg:text-sm  mb-2 cursor-pointer ${
                  activeFilter === filter
                    ? "bg-[#4f8fff] text-white"
                    : "bg-[#14141e] border border-[#4f8fff] text-white"
                }`}
                onClick={() => setActiveFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative mx-auto w-[300px] md:max-w-4xl h-[420px] mb-12">
          <div
            ref={carouselRef}
            className="relative h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {filteredProjects.map((project, index) => {
                console.log("Project : ", project);

                const isActive = index === activeIndex;
                const position =
                  index === activeIndex
                    ? "center"
                    : index ===
                        (activeIndex - 1 + filteredProjects.length) %
                          filteredProjects.length
                      ? "left"
                      : index === (activeIndex + 1) % filteredProjects.length
                        ? "right"
                        : index < activeIndex
                          ? "far-left"
                          : "far-right";

                // Calculate positions in pixels
                const xPosition = {
                  "far-left": isMobile ? "-85px" : "-450px",
                  left: isMobile ? "-60px" : "-220px",
                  center: "0px",
                  right: isMobile ? "60px" : "220px",
                  "far-right": isMobile ? "85px" : "450px",
                }[position];

                const opacity = {
                  "far-left": 0,
                  left: 0.4, // Reduced from 0.6
                  center: 1,
                  right: 0.4, // Reduced from 0.6
                  "far-right": 0,
                }[position];

                const scale = {
                  "far-left": 0.7,
                  left: 0.8, // Reduced from 0.85
                  center: 1,
                  right: 0.8, // Reduced from 0.85
                  "far-right": 0.7,
                }[position];

                return (
                  <motion.div
                    key={`${project.title}-${index}`}
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                    style={{
                      width: "300px",
                      cursor: isActive ? "pointer" : "pointer",
                      pointerEvents: ["left", "center", "right"].includes(
                        position
                      )
                        ? "auto"
                        : "none",
                      visibility: ["left", "center", "right"].includes(position)
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
                      if (
                        !isActive &&
                        ["left", "center", "right"].includes(position)
                      ) {
                        if (position === "left") {
                          goToPrev();
                        } else if (position === "right") {
                          goToNext();
                        }
                      } else if (isActive) {
                        setSelectedProject(project);
                      }
                    }}
                    initial={false}
                    animate={{
                      x: xPosition,
                      opacity: opacity,
                      scale: scale,
                      rotateY:
                        position === "left"
                          ? 25
                          : position === "right"
                            ? -25
                            : 0, // Increased rotation
                      translateZ: position === "center" ? 0 : -100, // Added depth
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300, // Reduced from 350 for smoother motion
                      damping: 35, // Increased from 30 for more stability
                      mass: 1, // Increased from 0.8 for more natural feel
                      opacity: {
                        duration: 0.5, // Increased from 0.4
                        ease: "easeInOut",
                      },
                      scale: {
                        duration: 0.5, // Increased from 0.4
                        ease: "easeInOut",
                      },
                      rotateY: {
                        duration: 0.7, // Added specific duration for rotation
                        ease: "easeInOut",
                      },
                    }}
                    whileHover={{
                      scale: isActive ? 1.05 : scale,
                      transition: {
                        duration: 0.3, // Increased from 0.2
                        ease: "easeOut",
                      },
                    }}
                  >
                    <motion.div
                      className={`bg-[#14141e] border border-[#252535] rounded-xl p-4 overflow-hidden transition-all duration-300 w-[300px] h-[400px] ${
                        isActive ? "border-[#4f8fff]/30" : ""
                      }`}
                      animate={{
                        boxShadow: isActive
                          ? "0 8px 32px rgba(79, 143, 255, 0.15)"
                          : "none",
                      }}
                    >
                      {/* Project Image */}
                      <div className="bg-[#252535] rounded-lg h-48 mb-4 overflow-hidden relative">
                        {project.thumbnail ? (
                          <PrismicNextImage
                            field={project.thumbnail}
                            className="w-full h-full object-cover"
                            alt={project.title || "Project image"}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-[#555555]">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Project Content */}
                      <div className="flex flex-col h-[calc(100%-13rem)]">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white text-lg font-semibold truncate pr-2">
                            {project.title}
                          </h3>
                          <div className="flex gap-1">
                            {project.live_link &&
                              project.live_link.link_type !== "Any" && (
                                <a
                                  href={project.live_link.url || ""}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 rounded-lg bg-[#252535] hover:bg-[#252535]/90 transition-colors"
                                >
                                  <Globe className="w-4 h-4 text-[#4f8fff]" />
                                </a>
                              )}
                            {project.github_link &&
                              project.github_link.link_type !== "Any" && (
                                <a
                                  href={project.github_link.url || ""}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 rounded-lg bg-[#252535] hover:bg-[#252535]/90 transition-colors"
                                >
                                  <Github className="w-4 h-4 text-[#4f8fff]" />
                                </a>
                              )}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {extractTechnologies(project).map(
                            (tech: any, techIndex: any) => (
                              <span
                                key={techIndex}
                                className="px-2 py-0.5 text-xs border border-primary-500 rounded-full text-white cursor-pointer hover:bg-[#4f8fff]/5 transition-colors"
                              >
                                {tech}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-[-3rem] left-0 right-0 flex items-center justify-center gap-5">
            <button
              onClick={goToPrev}
              className="w-6 h-6 cursor-pointer rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center hover:bg-[#252535] transition-colors"
              disabled={filteredProjects.length <= 1}
            >
              <svg width="12" height="12" viewBox="0 0 8 10" fill="#4f8fff">
                <path d="M7 1L1 5L7 9V1Z" fill="#4f8fff" />
              </svg>
            </button>

            {/* Enhanced Dots with colored lines */}
            <div className="flex items-center">
              {filteredProjects.map((_, index) => (
                <div key={index} className="flex items-center">
                  <motion.button
                    onClick={() => setActiveIndex(index)}
                    className="relative w-2 h-2"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Outer ring */}
                    <div
                      className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                        index <= activeIndex
                          ? "bg-[#4f8fff] shadow-[0_0_10px_#4f8fff]"
                          : "bg-[#252535]"
                      }`}
                    />
                    {/* Inner dot */}
                    {/* <div
                      className={`absolute inset-[3px] rounded-full transition-colors duration-300 ${
                        index <= activeIndex ? "bg-white" : "bg-[#4f8fff]"
                      }`}
                    /> */}
                  </motion.button>
                  {index < filteredProjects.length - 1 && (
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
              onClick={goToNext}
              className="w-6 h-6 rounded-full cursor-pointer bg-[#14141e] border border-[#4f8fff] flex items-center justify-center hover:bg-[#252535] transition-colors"
              disabled={filteredProjects.length <= 1}
            >
              <svg width="12" height="12" viewBox="0 0 8 10" fill="#4f8fff">
                <path d="M1 1L7 5L1 9V1Z" fill="#4f8fff" />
              </svg>
            </button>
          </div>
        </div>

        {/* Project Modal */}
        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      </div>
    </section>
  );
};

export default Projects;
