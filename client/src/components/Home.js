import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ background: "#f2e394", padding: "20px" }}>
      <h1>Welcome to Kindred!</h1>
      <Button color="danger" tag={Link} to="/login">
        login
      </Button>
        <Button color="danger" tag={Link} to="/signup">
        signup
        </Button> 
        <Button color="danger" tag={Link} to="/upload">
        upload</Button> 
        <Button color="danger" tag={Link} to="/search">
        search</Button> 
    </div>
  );
};

export default Home;
