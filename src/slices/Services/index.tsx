"use client";
import { FC, useRef, useEffect, useState } from "react";
import { Content, ImageField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
export type ServicesProps = SliceComponentProps<Content.ServicesSlice>;

interface ServiceShapeProps {
  isHovered: boolean;

  iconType: string;
}

interface Icon3DProps {
  iconType: string;
  isHovered: boolean;
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ImageField | null;
  iconType: string;
  index: number;
}

const ServiceShape: FC<ServiceShapeProps> = ({ isHovered, iconType }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getGeometry = () => {
    switch (iconType) {
      case "web":
        return <octahedronGeometry args={[1, 0]} />;
      case "mobile":
        return <boxGeometry args={[1.5, 1, 0.1]} />;
      case "ai":
        return <torusGeometry args={[0.7, 0.2, 16, 100]} />;
      default:
        return <octahedronGeometry args={[1, 0]} />;
    }
  };

  return (
    <mesh ref={meshRef}>
      {getGeometry()}
      <meshStandardMaterial
        color="#4f8fff"
        emissive="#4f8fff"
        emissiveIntensity={isHovered ? 0.5 : 0.2}
        wireframe={iconType === "ai"}
      />
    </mesh>
  );
};

const Icon3D: FC<Icon3DProps> = ({ iconType, isHovered }) => {
  return (
    <Canvas style={{ width: "100px", height: "100px" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ServiceShape isHovered={isHovered} iconType={iconType} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

const ServiceCard: FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  iconType,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: hovering ? -10 : 0,
        boxShadow: hovering
          ? "0 20px 25px -5px rgba(79, 143, 255, 0.1)"
          : "0 4px 6px -1px rgba(79, 143, 255, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="w-[280px] h-[320px] mt-10 lg:mt-0 lg:ml-0 md:ml-5    bg-[#14141e] rounded-xl border border-[#252535] flex flex-col items-center p-6  relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {/* Icon Container */}
      <div className="w-24 h-24 bg-[#0a0a12] rounded-full flex items-center justify-center mb-6">
        {icon ? (
          <div className="w-full h-full relative">
            <PrismicNextImage field={icon} fill className="object-contain" />
          </div>
        ) : (
          <Icon3D iconType={iconType} isHovered={isHovered} />
        )}
      </div>

      {/* Content */}
      <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-center text-sm leading-relaxed">
        {description}
      </p>

      {/* Indicator Dot */}
      <div
        className={`absolute bottom-6 w-4 h-4 border border-[#4f8fff] rounded-full transition-all duration-300 ${
          isHovered ? "bg-[#4f8fff]" : "border border-[#4f8fff] "
        }`}
      />
    </motion.div>
  );
};

const Services: FC<ServicesProps> = ({ slice }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const getServiceType = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("web")) return "web";
    if (lowerTitle.includes("mobile")) return "mobile";
    if (lowerTitle.includes("ai")) return "ai";
    return "web";
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap
            .timeline()
            .from(".services-header", {
              y: -30,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            })
            .from(
              ".services-cards > *",
              {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: "power3.out",
              },
              "-=0.4"
            );
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24"
      data-slice-type="services"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-10  pl-4 md:pl-8 relative z-30"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 ">
            <span className="text-[#4f8fff] text-lg tracking-wider neon-text">
              04
            </span>
            <h2 className="text-2xl  font-bold text-white tracking-wider ">
              SERVICES
            </h2>
          </div>
          <div className="w-32 h-0.5 mt-2 bg-[#4f8fff]  ml-9 neon-divider" />
        </motion.div>

        <div className="services-cards  flex flex-wrap  lg:flex-nowrap  justify-center items-center">
          {slice.primary.services?.map((service, index) => (
            <div key={index} className="flex items-center mx-auto">
              <ServiceCard
                title={service.title || ""}
                description={service.description || ""}
                icon={service.icon}
                iconType={getServiceType(service.title || "")}
                index={index}
              />
              {index < slice.primary.services.length - 1 && (
                <div className="hidden lg:block w-8 h-[1px] bg-[#4f8fff] mx-4 neon-divider" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
