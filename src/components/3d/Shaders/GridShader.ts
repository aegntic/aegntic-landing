import * as THREE from "three";

// Vertex shader for grid lighting
export const gridVertexShader = `
  varying vec3 vColor;
  varying vec3 vWorldPosition;
  
  void main() {
    vColor = color;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

// Fragment shader with efficient lighting calculations
export const gridFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  varying vec3 vColor;
  varying vec3 vWorldPosition;
  
  uniform float uTime;
  uniform vec3 uLightPosition;
  uniform float uLightRadius;
  uniform float uLightIntensity;
  uniform vec3 uLightColor;
  uniform vec3 uMousePosition;
  uniform float uMouseRepulsion;
  
  void main() {
    vec3 baseColor = vColor;
    
    // Calculate distance to light
    float distanceToLight = distance(vWorldPosition.xz, uLightPosition.xz);
    
    // Smooth falloff with exponential curve
    float lightEffect = 0.0;
    if (distanceToLight <= uLightRadius) {
      float normalizedDistance = distanceToLight / uLightRadius;
      lightEffect = pow(1.0 - normalizedDistance, 2.5) * uLightIntensity;
    }
    
    // Apply light color with intensity
    vec3 lightContribution = uLightColor * lightEffect;
    
    // Blend with base color
    vec3 finalColor = baseColor + lightContribution * vec3(0.15, 0.3, 0.6);
    
    // Clamp to prevent over-brightness
    finalColor = clamp(finalColor, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Create shader material with uniforms
export const createGridShaderMaterial = () => {
  return new THREE.ShaderMaterial({
    vertexShader: gridVertexShader,
    fragmentShader: gridFragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uLightPosition: { value: new THREE.Vector3(0, 0, 0) },
      uLightRadius: { value: 6.0 },
      uLightIntensity: { value: 0.8 },
      uLightColor: { value: new THREE.Vector3(0.0, 0.75, 1.0) }, // Electric blue
      uMousePosition: { value: new THREE.Vector3(0, 0, 0) },
      uMouseRepulsion: { value: 8.0 },
    },
    transparent: true,
    vertexColors: true,
  });
};
