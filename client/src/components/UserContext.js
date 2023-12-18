// import { createContext, useContext, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   const setUser = (user) => {
//     setCurrentUser(user);
//   };

//      const checkCurrentUser = () => {
//         fetch("/check_session")
//           .then((response) => response.json())
//           .then((data) => {
//            setCurrentUser(data);
//            console.log(data)
//           });
//         }
//         useEffect(() => {
//             checkCurrentUser()

//         },[currentUser])
//   return (
//     <UserContext.Provider value={{ currentUser, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);
