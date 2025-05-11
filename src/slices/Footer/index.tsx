"use client"
import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Footer`.
 */
export type FooterProps = SliceComponentProps<Content.FooterSlice>;

/**
 * Component for "Footer" Slices.
 */
const Footer: FC<FooterProps> = ({ slice }) => {
  return (
    <footer className="relative w-full mt-32">
      {/* Gradient overlay */}
      <div className="absolute inset-0 h-32 -top-32" />

      {/* Main footer content */}
      <div className="relative  border-t border-[#252535]/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Top section with name and field */}
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="relative group mb-4 sm:mb-0">
              <h3 className="text-xl font-mono text-white">
                {slice.primary.name}
              </h3>
              <div className="h-px w-0 group-hover:w-full bg-[#4f8fff] transition-all duration-300" />
            </div>

            {/* Pulse Wave */}
            <div className="hidden sm:block flex-1 mx-8 relative">
              <div className="h-[2px] w-full bg-[#4f8fff]/10">
                <div className="wave-pulse" />
              </div>
            </div>

            <div className="text-sm text-gray-400 font-mono tracking-wider">
              <span className="text-[#4f8fff]">{`{ `}</span>
              <span className="glitch-text relative inline-block">
                <span className="glitch-text-main">{slice.primary.field}</span>
                <span className="glitch-text-r absolute top-0 left-0 w-full">{slice.primary.field}</span>
                <span className="glitch-text-b absolute top-0 left-0 w-full">{slice.primary.field}</span>
              </span>
              <span className="text-[#4f8fff]">{` }`}</span>
            </div>
          </div>

          {/* Bottom section with year and copyright */}
          <div className="flex items-center justify-center pt-6 mt-8 border-t border-[#252535]/30">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="text-[#4f8fff]">©</span>
              <span>{slice.primary.year}</span>
              <span className="h-1 w-1 rounded-full bg-[#4f8fff]/50" />
              <span className="hover:text-white transition-colors">
                All rights reserved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-[#4f8fff]/10 blur-sm" />

      <style jsx>{`
        .wave-pulse {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, transparent, #4f8fff, transparent);
          transform: translateY(-50%);
          filter: blur(2px);
          animation: wavePulse 2s ease-in-out infinite;
        }

        @keyframes wavePulse {
          0% {
            opacity: 0;
            transform: translateY(-50%) scaleX(0.3);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-50%) scaleX(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) scaleX(0.3);
          }
        }

        .glitch-text-main {
          text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                      -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
                      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitch 500ms infinite;
        }

        .glitch-text-r {
          text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75);
          animation: glitch 650ms infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-0.025em, -0.0125em);
          opacity: 0.75;
        }

        .glitch-text-b {
          text-shadow: -0.05em 0 0 rgba(0, 0, 255, 0.75);
          animation: glitch 375ms infinite;
          clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
          transform: translate(0.0125em, 0.025em);
          opacity: 0.75;
        }

        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                        -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                        -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                        0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                        0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                        0.05em 0 0 rgba(0, 255, 0, 0.75),
                        0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                        0.05em 0 0 rgba(0, 255, 0, 0.75),
                        0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
                        -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
                        -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;



