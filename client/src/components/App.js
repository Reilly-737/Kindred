import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Search from "./Search";
import Signup from "./Signup";
import Profile from "./Profile";
import Upload from "./Upload";
import AboutUs from "./AboutUs";

function App() {
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     // Simulate a delay for demonstration purposes
     const timeoutId = setTimeout(() => {
       setLoading(false);
     }, 3000);

     return () => clearTimeout(timeoutId);
   }, []);
  return (
    <Router>
      <div>
        {loading ? <LoadingScreen /> : <YourMainContent />}
        <Header />
        <Switch>
          <Route path="/search" component={Search} />
          <Route path="/signup" component={Signup} />
          <Route path="/profile" component={Profile} />
          <Route path="/upload" component={Upload} />
          <Route path="/about us" component={AboutUs} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
