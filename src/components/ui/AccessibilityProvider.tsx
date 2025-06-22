"use client";

import { useEffect, useState, createContext, useContext } from "react";

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(
  null,
);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider",
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    keyboardNavigation: false,
  });

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    updateSetting("reducedMotion", mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      updateSetting("reducedMotion", e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Detect high contrast preference
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
    updateSetting("highContrast", highContrastQuery.matches);

    const handleContrastChange = (e: MediaQueryListEvent) => {
      updateSetting("highContrast", e.matches);
    };

    highContrastQuery.addEventListener("change", handleContrastChange);

    // Detect screen reader usage
    const hasScreenReader =
      window.navigator.userAgent.includes("NVDA") ||
      window.navigator.userAgent.includes("JAWS") ||
      window.speechSynthesis?.speaking ||
      "speechSynthesis" in window;
    updateSetting("screenReader", hasScreenReader);

    // Keyboard navigation detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        updateSetting("keyboardNavigation", true);
      }
    };

    const handleMouseDown = () => {
      updateSetting("keyboardNavigation", false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      highContrastQuery.removeEventListener("change", handleContrastChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Apply CSS custom properties based on accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    if (settings.reducedMotion) {
      root.style.setProperty("--animation-duration", "0.01s");
      root.style.setProperty("--transition-duration", "0.01s");
    } else {
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--transition-duration");
    }

    if (settings.highContrast) {
      root.style.setProperty("--primary-color", "#ffffff");
      root.style.setProperty("--secondary-color", "#000000");
      root.style.setProperty("--accent-color", "#ffff00");
    } else {
      root.style.removeProperty("--primary-color");
      root.style.removeProperty("--secondary-color");
      root.style.removeProperty("--accent-color");
    }

    // Expose settings globally for 3D scene
    (window as any).accessibilitySettings = settings;
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting }}>
      {children}

      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="accessibility-announcer"
      />

      {/* Skip links for keyboard navigation */}
      {settings.keyboardNavigation && (
        <div className="fixed top-0 left-0 z-[9999]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 
                       bg-white text-black px-4 py-2 rounded focus:outline-none 
                       focus:ring-2 focus:ring-blue-500"
          >
            Skip to main content
          </a>
        </div>
      )}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
