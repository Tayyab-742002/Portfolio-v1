"use client";
import { FC, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import * as THREE from "three";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const Hero: FC<SliceComponentProps<Content.HeroSlice>> = ({ slice }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Create dots
    const dotsCount = 50;
    const dots: THREE.Mesh[] = [];
    const dotGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const dotMaterial = new THREE.MeshPhongMaterial({
      color: 0x4f8fff,
      transparent: true,
      opacity: 0.6,
    });

    // Create and position dots randomly
    for (let i = 0; i < dotsCount; i++) {
      const dot = new THREE.Mesh(dotGeometry, dotMaterial.clone());

      // Random position within a reasonable range
      dot.position.set(
        (Math.random() - 0.5) * 20, // X: -10 to 10
        (Math.random() - 0.5) * 20, // Y: -10 to 10
        (Math.random() - 0.5) * 10 - 5 // Z: -10 to 0
      );

      // Store initial opacity for animation
      (dot.material as THREE.MeshPhongMaterial).userData = {
        initialOpacity: 0.6,
        pulseOffset: Math.random() * Math.PI * 2, // Random phase offset
      };

      dots.push(dot);
      scene.add(dot);
    }

    // Create geometric shapes (your existing shapes code)
    const geometry1 = new THREE.TetrahedronGeometry(1);
    const geometry2 = new THREE.OctahedronGeometry(1);
    const geometry3 = new THREE.IcosahedronGeometry(1);

    const material = new THREE.MeshPhongMaterial({
      color: 0x4f8fff,
      opacity: 0.3,
      transparent: true,
    });

    const shape1 = new THREE.Mesh(geometry1, material);
    const shape2 = new THREE.Mesh(geometry2, material);
    const shape3 = new THREE.Mesh(geometry3, material);

    scene.add(shape1, shape2, shape3);

    // Position shapes
    shape1.position.set(-2, 1, -5);
    shape2.position.set(2, -1, -5);
    shape3.position.set(0, 2, -5);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0x4f8fff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(ambientLight, pointLight);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      // Throttle to 30fps on mobile
      // if (window.innerWidth < 768) {
      //   setTimeout(() => {
      //     requestAnimationFrame(animate);
      //   }, 1000 / 30);
      // } else {
      //   requestAnimationFrame(animate);
      // }
      requestAnimationFrame(animate);
      // Reduce animation complexity on mobile
      const isMobile = window.innerWidth < 768;
      const rotationSpeed = isMobile ? 0.005 : 0.01;

      shape1.rotation.x += rotationSpeed;
      shape2.rotation.y += rotationSpeed;
      shape3.rotation.z += rotationSpeed;

      // Optimize dots animation
      const time = Date.now() * (isMobile ? 0.0005 : 0.001);
      dots.forEach((dot, index) => {
        if (index % (isMobile ? 2 : 1) === 0) {
          // Animate fewer dots on mobile
          const material = dot.material as THREE.MeshPhongMaterial;
          const offset = material.userData.pulseOffset;
          const initialOpacity = material.userData.initialOpacity;

          material.opacity =
            initialOpacity * (0.6 + 0.4 * Math.sin(time * 2 + offset));

          if (!isMobile) {
            dot.position.y += Math.sin(time + offset) * 0.0005;
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // GSAP Animations
    // Name entrance
    if (textRef.current) {
      gsap.from(textRef.current, {
        y: 50,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      });
    }
    // Typing effect for expertise
    const expertiseText = slice.primary.expertise || "";

    const words = expertiseText.split(" | ");

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
      });
    }

    if (expertiseRef.current) {
      const typeWords = gsap.timeline({ repeat: -1 });
      words.forEach((word: any) => {
        typeWords
          .to(expertiseRef.current, {
            duration: 1,
            text: word,
            ease: "none",
          })
          .to({}, { duration: 1 }); // Pause between words
      });
    }

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry1.dispose();
      geometry2.dispose();
      geometry3.dispose();
      material.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      dots.forEach((dot) => {
        (dot.material as THREE.MeshPhongMaterial).dispose();
      });
    };
  }, [slice.primary.expertise]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Scene Container */}
      <div ref={sceneRef} className="absolute inset-0 -z-10" />

      {/* Content Container */}
      <div className="container mx-auto px-4 text-center">
        {/* Avatar */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4f8fff] to-transparent opacity-30 blur-xl animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-[#14141e]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4f8fff20] to-[#14141e] border border-[#4f8fff30]">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <PrismicNextImage
                  field={slice.primary.avatar}
                  className="w-full h-full object-cover"
                  fallbackAlt=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <div ref={textRef} className="mt-10 mb-10 ">
          <PrismicRichText
            field={slice.primary.name}
            components={{
              paragraph: ({ children }) => (
                <h1 className="text-4xl font-bold text-white glow-text mb-2">
                  {children}
                </h1>
              ),
            }}
          />
        </div>

        {/* Title */}
        <PrismicRichText
          field={slice.primary.title}
          components={{
            paragraph: ({ children }) => (
              <h2 className="text-2xl text-[#aaaaff] mb-4">{children}</h2>
            ),
          }}
        />

        {/* Expertise */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span ref={expertiseRef} className="text-lg text-white" />
          <span ref={cursorRef} className="w-0.5 h-6 bg-[#4f8fff]" />
        </div>

        {/* CTA Button */}
        <PrismicNextLink
          // field={slice.primary.cta}
          href={"#projects"}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#4f8fff] text-white hover:bg-[#4f8fff20] transition-all duration-300 group"
        >
          EXPLORE WORK
          <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
            →
          </span>
        </PrismicNextLink>

      
       
      </div>
    </section>
  );
};

export default Hero;
