// DarkModeToggle.tsx
import React from "react";
import { useDarkMode } from "../../DarkModeContext"; // adjust the import path
import Toggle from "../common/toggle/toggle"

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
    const handleToggleClick = () => {
      toggleDarkMode()
    };

  return <Toggle onClick={handleToggleClick} />;
};

export default DarkModeToggle;
