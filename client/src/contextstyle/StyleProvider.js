import React, { useState } from "react";
import { StyleContext, lightTheme, darkTheme} from "./StyleContext";

export const StyleProvider = ({ children }) => {
  const [isLightTheme, setIsLightTheme] = useState(true);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", isLightTheme ? "#fff" : "#000");
    root.style.setProperty( "--background-color", isLightTheme ? "#282c34" : "#fff");
    setIsLightTheme(!isLightTheme);
  };

  const theme = isLightTheme ? lightTheme : darkTheme;

  return (
    <StyleContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </StyleContext.Provider>
  );
};
