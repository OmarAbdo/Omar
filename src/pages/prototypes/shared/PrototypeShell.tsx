import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PrototypeShellProps {
  children: React.ReactNode;
  bgColor: string;
  textColor: string;
  accentColor: string;
  fontLinks?: string[];
  title: string;
}

const PrototypeShell: React.FC<PrototypeShellProps> = ({
  children,
  bgColor,
  textColor,
  accentColor,
  fontLinks = [],
  title,
}) => {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    // Preconnect
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect);
    links.push(preconnect);

    const preconnectStatic = document.createElement("link");
    preconnectStatic.rel = "preconnect";
    preconnectStatic.href = "https://fonts.gstatic.com";
    preconnectStatic.crossOrigin = "anonymous";
    document.head.appendChild(preconnectStatic);
    links.push(preconnectStatic);

    // Font links
    fontLinks.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, [fontLinks]);

  return (
    <div
      className="h-screen w-full overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Bottom bar — back button + prototype label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Portfolio
        </Link>
        <span
          className="px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md"
          style={{
            backgroundColor: `${accentColor}10`,
            color: `${accentColor}90`,
            border: `1px solid ${accentColor}20`,
          }}
        >
          {title} — UI Prototype
        </span>
      </motion.div>

      {children}
    </div>
  );
};

export default PrototypeShell;
