import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const ErrorPage = () => {
  return (
    <>
      <Header />
      <div id="outlet">
        <div className="one_craft">
          <img
            src="https://i.imgur.com/0lOKgCK.jpg"
            alt="Still in the studio"
            style={{ maxWidth: "30%", borderRadius: "4px", marginTop: "10px" }}
          />
          <h2>Oh no!</h2>
          <h3>Looks like what you are looking for has been painted over!</h3>
          <Link to="/">
            <button>Return home</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
