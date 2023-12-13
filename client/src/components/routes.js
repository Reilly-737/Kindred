import App from "./App";
import Home from "./Home";
import Upload from "./Upload";
import Signup from "./Signup";
import Login from "./Login";
import Profile from "./Profile";
import AboutUs from "./AboutUs";
import ErrorPage from "./ErrorPage";
import SearchForm from "./Search";
const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/upload",
        element: <Upload />,
      },
      {
        path: "/aboutus",
        element: <AboutUs />,
      },
      {
        path: "/profile/:user_id", 
        element: <Profile />,
      },
      {
        path: "/search",
        element: <SearchForm />,
      },
    ],
  },
];

export default routes;
