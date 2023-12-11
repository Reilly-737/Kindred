import React, { createContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import AlertBar from "./AlertBar";

export const TagsContext = createContext();

const App = ({ children }) => {
  // State for displaying alerts
  const [message, setMessage] = useState(null);
  const [snackType, setSnackType] = useState("");

  // State for managing user data
  const [user, setUser] = useState(null);

  // State for managing tags
  const [tags, setTags] = useState([]);

  // useEffect to check session and fetch user data
  useEffect(() => {
    fetch("/check_session")
      .then((resp) => {
        if (resp.ok) {
          resp.json().then(setUser);
        } else {
          resp.json().then((errorObj) => {
            handleSnackType("error");
            setAlertMessage(errorObj.message);
          });
        }
      })
      .catch((errorObj) => {
        handleSnackType("error");
        setAlertMessage(errorObj.message);
      });
  }, []);

  // useEffect to fetch tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/tags"); // Adjust the endpoint accordingly
        if (response.ok) {
          const tagsData = await response.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Function to update user data
  const updateUser = (user) => {
    setUser(user);
  };

  // Function to set alert message
  const setAlertMessage = (msg) => {
    setMessage(msg);
  };

  // Function to set snack type
  const handleSnackType = (type) => {
    setSnackType(type);
  };

  // Context object to be passed to Outlet
  const ctx = {
    user,
    setAlertMessage,
    handleSnackType,
    updateUser,
  };

  return (
    <div>
    
      <Header
        user={user}
        updateUser={updateUser}
        setAlertMessage={setAlertMessage}
        handleSnackType={handleSnackType}
      />
      {message && (
        <AlertBar
          message={message}
          snackType={snackType}
          setAlertMessage={setAlertMessage}
          handleSnackType={handleSnackType}
        />
      )}
      <div id="outlet">
        <Outlet context={ctx} />
      </div>
      <TagsContext.Provider value={{ tags }}>{children}</TagsContext.Provider>
    </div>
  );
};

export default App;
