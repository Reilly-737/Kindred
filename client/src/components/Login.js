import { useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { updateUser, setAlertMessage, handleSnackType } = useOutletContext();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((resp) => {
        if (resp.ok) {
          resp.json()
            .then((userObj) => {
              console.log("Login successful, user object:", userObj); // Log user object
              updateUser(userObj);
              navigate(`/profile/${userObj.user_id}`);
              //handleSnackType("success");
              //setAlertMessage("Welcome back!");
            })
        
        } else {
          resp.json().then((err) => {
            handleSnackType("error");
            setAlertMessage(err.message);
          });
        }
      })
      .catch((errObj) => {
        handleSnackType("error");
        setAlertMessage("An error occurred during login.");
      });
  };

  return (
    <div className="main">
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email or Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="block"
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="block"
          />
          <div className="buttons">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>

      <div>
        <h2>Forgot to make an account?</h2>
        <p>Click below to sign up and get started!</p>
        <Link to={"/signup"}>
          <div className="buttons">
            <button>Sign up</button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Login;