import { createContext } from "react";

// To Define light and dark themes
export const lightTheme = {
  background:
    "radial-gradient(circle at 7.4% 45.1%, rgb(236, 206, 251) 0%, rgb(205, 237, 246) 45.1%, rgb(227, 251, 252) 78.4%, rgb(230, 247, 235) 90%)",
  primaryColor: "#defcf9",
  secondaryColor: "#cadefc",
 
};

export const darkTheme = {
  background: "#282c34",
  primaryColor: "#someDarkVariant",
  secondaryColor: "#anotherDarkVariant",
//add these again later
};

export const StyleContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});




