import { useEffect, useState } from "react";

export function useWindowSize() {
  // Initialize state with default values so SSR doesn't break
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      // Only update if values differ to avoid unnecessary re-renders
      setSize((prev) => {
        if (prev.width === window.innerWidth && prev.height === window.innerHeight) {
          return prev;
        }
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Update on mount (important)

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
