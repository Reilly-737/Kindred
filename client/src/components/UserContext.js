import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const setUser = (user) => {
    setCurrentUser(user);
  };

  const checkCurrentUser = () => {
    fetch("/check_session")
      .then((response) => response.json())
      .then((data) => {
        console.log("Session check data:", data); // Log session data
        if (data && data.user_id) {
          fetch(`/users/${data.user_id}`)
            .then((response) => response.json())
            .then((userData) => {
              console.log("Fetched user data:", userData); // Log user data
              if (userData) {
                setUser(userData);
              }
            });
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Error in check session:", error);
        setUser(null);
      });
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
