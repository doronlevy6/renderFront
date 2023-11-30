//src\components\LoginPage.js:

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { AuthContext } from "../contexts/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register`, {
        username,
        password,
        email,
      });

      if (response.data.success) {


        const loginResponse = await axios.post(`${apiUrl}/login`, {
          username,
          password,
        });


        if (loginResponse.data.success) {
          setIsAuthenticated(true);
          setUser(loginResponse.data.user);
          navigate("/welcome");
        } else {
          setErrorMessage(loginResponse.data.message);
        }
      } else {
        setErrorMessage(response.data.message);
      }
      setUsername("");
      setPassword("");
      setEmail("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        navigate("/welcome");
      } else {
        setErrorMessage(response.data.message);
      }
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-page">
      {!isRegister ? (
        <React.Fragment>
          <button onClick={() => setIsRegister(true)}>Go to Register</button>
          <h2>Login </h2>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="submit-button" type="submit">
              Login
            </button>
          </form>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={() => setIsRegister(false)}>Go to Login</button>
          <h2>Register </h2>
          <form className="login-form" onSubmit={handleRegister}>
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="submit-button" type="submit">
              Register
            </button>
          </form>
        </React.Fragment>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
