import React, { createContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import AlertBar from "./AlertBar";
export const TagsContext = createContext();

const App = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [snackType, setSnackType] = useState("");
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);

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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/tags"); 
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

  const updateUser = (user) => {
    setUser(user);
  };
  const setAlertMessage = (msg) => {
    setMessage(msg);
  };

  const handleSnackType = (type) => {
    setSnackType(type);
  };

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
