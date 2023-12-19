import React, { useContext } from "react";
import { StyleContext } from "../contextstyle/StyleContext";

const ThemeToggleButton = () => {
  const { toggleTheme } = useContext(StyleContext);

  return <button onClick={toggleTheme}>Mode</button>;
};

export default ThemeToggleButton;
