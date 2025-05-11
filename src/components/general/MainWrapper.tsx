"use client";
import { useEffect, useState } from "react";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    scrollHeight: 0,
    scrollY: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setDimensions((prev) => ({
        ...prev,
        width: window.innerWidth,
        scrollHeight: Math.max(
          document.documentElement.scrollHeight,
          window.innerHeight
        ),
      }));
    };

    const handleScroll = () => {
      setDimensions((prev) => ({
        ...prev,
        scrollY: window.scrollY,
      }));
    };

    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    const timeoutId = setTimeout(handleResize, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const cellWidth = 200;
  const cellHeight = 300;
  const verticalLines = mounted
    ? Math.ceil(dimensions.width / cellWidth) + 1
    : 0;
  const horizontalLines = mounted
    ? Math.ceil(dimensions.scrollHeight / cellHeight) + 5
    : 0;

  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className="relative lg:w-[1000px] w-full">
        {mounted && (
          <>
            {/* Animated vertical lines container */}
            <div
              className="fixed inset-0 z-0 overflow-visible"
              style={{
                height: `${dimensions.scrollHeight}px`,
                transform: `translateY(-${dimensions.scrollY * 0.5}px)`,
              }}
            >
              {Array.from({ length: verticalLines }).map((_, index) => (
                <div
                  key={`v-${index}`}
                  className="animated-vertical-line"
                  style={{
                    left: `${index * cellWidth}px`,
                    animationDelay: `${index * 0.2}s`,
                    height: `${dimensions.scrollHeight}px`,
                  }}
                />
              ))}
            </div>

            {/* Animated horizontal lines container */}
            <div
              className="fixed left-0 right-0 top-0 z-0 overflow-visible"
              style={{
                height: `${dimensions.scrollHeight}px`,
                transform: `translateY(-${dimensions.scrollY * 0.5}px)`,
              }}
            >
              {Array.from({ length: horizontalLines }).map((_, index) => (
                <div
                  key={`h-${index}`}
                  className="animated-horizontal-line"
                  style={{
                    top: `${index * cellHeight}px`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Main content */}
        <main className="relative z-10 container mx-auto px-4">{children}</main>

        <style jsx>{`
          .grid-background {
            background-image:
              linear-gradient(
                to right,
                rgba(79, 143, 255, 0.1) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(79, 143, 255, 0.1) 1px,
                transparent 1px
              );
            background-size: ${cellWidth}px ${cellHeight}px;
            background-attachment: scroll;
            pointer-events: none;
            will-change: transform;
            animation: gridGlow 4s ease-in-out infinite;
          }

          .animated-vertical-line {
            position: absolute;
            top: 0;
            width: 1px;
            height: 100%;
            background: linear-gradient(
              to bottom,
              rgba(79, 143, 255, 0.4) 0%,
              rgba(79, 143, 255, 0.1) 100%
            );
            box-shadow: 0 0 8px rgba(79, 143, 255, 0.3);
            animation: lineGlow 4s ease-in-out infinite;
            pointer-events: none;
            will-change: transform;
          }

          .animated-horizontal-line {
            position: absolute;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(
              to right,
              rgba(79, 143, 255, 0.4) 0%,
              rgba(79, 143, 255, 0.1) 100%
            );
            box-shadow: 0 0 8px rgba(79, 143, 255, 0.3);
            animation: lineGlow 4s ease-in-out infinite;
            pointer-events: none;
            will-change: transform;
          }

          @keyframes gridGlow {
            0% {
              box-shadow: 0 0 5px rgba(79, 143, 255, 0.2);
              opacity: 0.5;
            }
            50% {
              box-shadow: 0 0 20px rgba(79, 143, 255, 0.4);
              opacity: 1;
            }
            100% {
              box-shadow: 0 0 5px rgba(79, 143, 255, 0.2);
              opacity: 0.5;
            }
          }

          @keyframes lineGlow {
            0% {
              opacity: 0.3;
              box-shadow: 0 0 5px rgba(79, 143, 255, 0.2);
            }
            50% {
              opacity: 0.7;
              box-shadow: 0 0 15px rgba(79, 143, 255, 0.4);
            }
            100% {
              opacity: 0.3;
              box-shadow: 0 0 5px rgba(79, 143, 255, 0.2);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MainWrapper;
