import React from "react";
import { Switch } from "@headlessui/react";
import { useTheme } from "../../../utils/ThemeContext";

interface ToggleProps {
  onClick: () => void; // Define the expected function signature
  toggled: boolean; // Define the expected boolean prop
}

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

const Toggle: React.FC<ToggleProps> = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      checked={theme === "dark"}
      onChange={toggleTheme}
      className={classNames(
        theme === "dark" ? "bg-custom-teal" : "bg-gray-200",
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
      )}
    >
      <span className="sr-only">Toggle Theme</span>
      <span
        className={classNames(
          theme === "dark" ? "translate-x-5" : "translate-x-0",
          "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      ></span>
    </Switch>
  );
};

export default Toggle;
