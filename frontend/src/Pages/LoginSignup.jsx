import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import Icon from "../Components/Icon/Icon";

// Friendlier wording for the messages the API sends back.
const ERROR_MESSAGES = {
  "Wrong Password": "That password is incorrect.",
  "Wrong email id": "We couldn’t find an account with that email address.",
  "existing user found with same email address": "An account with this email already exists. Log in instead.",
};

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showError = (message) => setError(ERROR_MESSAGES[message] || message || "Something went wrong. Please try again.");

  const login = async () => {
    setLoading(true);
    let responseData;
    try {
      await fetch('http://localhost:4000/login', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }).then((response) => response.json()).then((data) => responseData = data);

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        showError(responseData.errors);
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("We couldn’t log you in. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    setLoading(true);
    let responseData;
    try {
      await fetch('http://localhost:4000/signup', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }).then((response) => response.json()).then((data) => responseData = data);

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        showError(responseData.errors);
      }
    } catch (error) {
      console.error("Signup error:", error);
      showError("We couldn’t create your account. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (state === "Login") {
      login();
    } else {
      signup();
    }
  };

  const switchTo = (next) => {
    setState(next);
    setError("");
  };

  const isLogin = state === "Login";

  return (
    <div className="loginsignup">
      <h1 className="page-title display">{isLogin ? "Log in" : "Create account"}</h1>
      <p className="loginsignup-subtitle">
        {isLogin
          ? "Log in to check out and keep your cart across devices."
          : "Create an account to check out and keep your cart across devices."}
      </p>

      <form onSubmit={handleSubmit} className="loginsignup-form">
        {error && (
          <p className="notice notice--error" role="alert">
            <Icon name="alert" />
            <span>{error}</span>
          </p>
        )}

        {!isLogin && (
          <div className="field">
            <label htmlFor="username" className="label">Full name</label>
            <input
              id="username"
              name='username'
              value={formData.username}
              onChange={changeHandler}
              type="text"
              autoComplete="name"
              className="input"
              required
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="email" className="label">Email address</label>
          <input
            id="email"
            name='email'
            value={formData.email}
            onChange={changeHandler}
            type="email"
            autoComplete="email"
            className="input"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="input"
            aria-describedby={isLogin ? undefined : "password-hint"}
            required
            minLength="6"
          />
          {!isLogin && <p id="password-hint" className="hint">At least 6 characters.</p>}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading
            ? (isLogin ? "Logging in…" : "Creating account…")
            : (isLogin ? "Log in" : "Create account")}
        </button>

        {!isLogin && (
          <p className="hint">By creating an account you agree to our Terms of Service and Privacy Policy.</p>
        )}
      </form>

      <p className="loginsignup-switch">
        {isLogin ? "New to StepStyle?" : "Already have an account?"}{" "}
        <button type="button" className="link" onClick={() => switchTo(isLogin ? "Sign Up" : "Login")}>
          {isLogin ? "Create an account" : "Log in"}
        </button>
      </p>
    </div>
  );
};

export default LoginSignup;
