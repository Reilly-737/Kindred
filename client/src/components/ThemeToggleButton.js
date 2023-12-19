import React, { useContext } from "react";
import { StyleContext } from "../contextstyle/StyleContext";

const ThemeToggleButton = () => {
  const { toggleTheme } = useContext(StyleContext);

  return <button onClick={toggleTheme} className="custom-button">Mode</button>;
};

export default ThemeToggleButton;
