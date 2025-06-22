"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  progress: number;
  message?: string;
  onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  message = "Loading 3D Scene...",
  onComplete,
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100 && onComplete) {
      const timer = setTimeout(onComplete, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-light text-white mb-2">
          {message}
          {dots}
        </h2>

        <p className="text-gray-400 text-sm">
          {Math.round(progress)}% Complete
        </p>

        {progress < 50 && (
          <p className="text-gray-500 text-xs mt-4">
            Initializing WebGL and 3D assets...
          </p>
        )}

        {progress >= 50 && progress < 90 && (
          <p className="text-gray-500 text-xs mt-4">
            Loading shaders and textures...
          </p>
        )}

        {progress >= 90 && (
          <p className="text-gray-500 text-xs mt-4">
            Finalizing scene setup...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
