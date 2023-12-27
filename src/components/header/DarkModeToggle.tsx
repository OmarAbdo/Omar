import React from "react";
import { useDarkMode } from "../../DarkModeContext";
import Toggle from "../common/toggle/toggle"

const DarkModeToggle: React.FC = () => {
  const { toggleDarkMode } = useDarkMode();
    const handleToggleClick = () => {
      toggleDarkMode()
    };

  return <Toggle onClick={handleToggleClick} />;
};

export default DarkModeToggle;
