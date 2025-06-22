"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import gsap from "gsap";

import { Scene, FinalScreen } from "./3d/Scene";
import PerformanceMonitor from "./3d/Performance/PerformanceMonitor";
import AccessibilityProvider from "./ui/AccessibilityProvider";
import ErrorBoundary from "./ui/ErrorBoundary";
import LoadingScreen from "./ui/LoadingScreen";

// Main component
const AsciiIntro = ({
  onIntroComplete,
}: {
  onIntroComplete: () => void;
}) => {
  const [crumbleStarted, setCrumbleStarted] = useState(false);
  const [showFoundation, setShowFoundation] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!crumbleStarted) {
      setCrumbleStarted(true);

      // After 2 seconds, show "aegntic.foundation"
      setTimeout(() => {
        setShowFoundation(true);
      }, 2000);

      // Allow scrolling after intro is complete
      setTimeout(() => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            onComplete: onIntroComplete,
          });
        }
      }, 4000);
    }
  };

  useEffect(() => {
    // Prevent scrolling during intro
    document.body.style.overflow = "hidden";

    // Simple loading animation - complete after 2 seconds
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(timer);
    };
  }, []);

  return (
    <AccessibilityProvider>
      {!isLoaded ? (
        <LoadingScreen
          progress={100}
          message="Initializing 3D Experience"
        />
      ) : (
        <ErrorBoundary>
          <div
            ref={containerRef}
            className="fixed inset-0 z-50 w-full h-full bg-black"
            id="main-content"
            role="main"
            aria-label="Interactive 3D scene"
          >
            <Canvas
              gl={{
                powerPreference: "high-performance",
                antialias: true,
                alpha: false,
              }}
              camera={{
                position: [0, 0, 10],
                fov: 75,
                near: 0.1,
                far: 1000,
              }}
            >
              <PerformanceMonitor adaptiveQuality={true} />
              {!showFoundation ? (
                <Scene onClick={handleClick} crumbleStarted={crumbleStarted} />
              ) : (
                <FinalScreen />
              )}
            </Canvas>
            {!crumbleStarted && (
              <div
                className="absolute bottom-10 left-0 right-0 text-center text-white text-opacity-50"
                role="status"
                aria-live="polite"
              >
                Click anywhere to continue
              </div>
            )}
          </div>
        </ErrorBoundary>
      )}
    </AccessibilityProvider>
  );
};

export default AsciiIntro;
