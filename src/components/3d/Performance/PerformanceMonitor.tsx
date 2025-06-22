"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  adaptiveQuality?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  adaptiveQuality = true,
}) => {
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0,
  });

  const fpsHistory = useRef<number[]>([]);
  const qualityLevel = useRef(1.0); // 0.0 to 1.0

  useFrame((state) => {
    frameCount.current++;
    const now = Date.now();

    // Calculate FPS every 10 frames
    if (frameCount.current % 10 === 0) {
      const deltaTime = now - lastTime.current;
      const fps = Math.round((10 * 1000) / deltaTime);
      const frameTime = deltaTime / 10;

      // Get memory usage if available
      const memoryUsage = (performance as any).memory
        ? (performance as any).memory.usedJSHeapSize / 1048576 // MB
        : 0;

      // Get render info
      const renderer = state.gl;
      const renderInfo = renderer.info.render;

      const newMetrics: PerformanceMetrics = {
        fps,
        frameTime,
        memoryUsage,
        drawCalls: renderInfo.calls,
        triangles: renderInfo.triangles,
      };

      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);

      // Adaptive quality based on FPS
      if (adaptiveQuality) {
        fpsHistory.current.push(fps);
        if (fpsHistory.current.length > 30) {
          fpsHistory.current.shift();
        }

        const avgFps =
          fpsHistory.current.reduce((a, b) => a + b, 0) /
          fpsHistory.current.length;

        if (avgFps < 30) {
          qualityLevel.current = Math.max(0.3, qualityLevel.current - 0.1);
        } else if (avgFps > 50) {
          qualityLevel.current = Math.min(1.0, qualityLevel.current + 0.05);
        }

        // Expose quality level globally
        (window as any).performanceQuality = qualityLevel.current;
      }

      lastTime.current = now;
    }
  });

  // Expose metrics globally for debugging
  useEffect(() => {
    (window as any).performanceMetrics = metrics;
  }, [metrics]);

  return null;
};

export default PerformanceMonitor;
