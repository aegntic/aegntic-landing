import type { MutableRefObject } from "react";
import type * as THREE from "three";

export interface ParticleProps {
  position: [number, number, number];
  scale: number;
  color: THREE.Color;
  baseOpacity: number;
  rotationSpeed: number;
  fadeDelay: number;
}

export type TesseractProps = ParticleProps;

export interface CubeProps extends Omit<ParticleProps, "baseOpacity"> {
  opacity: number;
}

export interface CameraAnimationProps {
  active: boolean;
  textRef: MutableRefObject<THREE.Group | null>;
}

export interface FlippingTextProps {
  cameraAngle: number;
}

export interface FlippingLetterProps {
  char: string;
  backChar: string;
  position: [number, number, number];
  cameraAngle: number;
}

export interface LetterProps {
  position: [number, number, number];
  char: string;
}

export interface SceneProps {
  onClick: () => void;
  crumbleStarted: boolean;
}

export interface DigitalRainParticle {
  x: number;
  y: number;
  z: number;
}

export interface FloatingParticle {
  type: "tesseract" | "triangular" | "cube";
  position: [number, number, number];
  scale: number;
  color: THREE.Color;
  baseOpacity: number;
  rotationSpeed: number;
  fadeDelay: number;
}
