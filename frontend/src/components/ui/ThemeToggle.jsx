import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { isDark, setIsDark, toggleTheme } = useContext(StoreContext);

  return (
    <button className="text-center cursor-pointer" onClick={toggleTheme}>
      {isDark ? (
        <Sun className="h-6 w-6 text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-indigo-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
