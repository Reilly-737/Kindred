import React, { useState, useContext } from "react";
import { StyleContext, lightTheme, darkTheme} from "./StyleContext";

export const StyleProvider = ({ children }) => {
  const [isLightTheme, setIsLightTheme] = useState(true);

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
  };

  const theme = isLightTheme ? lightTheme : darkTheme;

  return (
    <StyleContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </StyleContext.Provider>
  );
};
