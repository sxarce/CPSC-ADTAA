import "./LoginPage.css";
import svg from "../../assets/svg/background_twirl.svg";
import ualrLogo from "../../assets/svg/ualrLogo.svg";
import userLogo from "../../assets/svg/briefcase.svg";
import passLogo from "../../assets/svg/lock.svg";
import { useState, useEffect } from "react";

const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rememberBool, setRememberBool] = useState(false);

  return (
    <div className="login-page-container">
      <img className="background-twirl" src={svg} />
      <div className="login-form-container">
        <div className="login-form-title">
          <h1 className="login-form-header-text">Sign Into Your Account</h1>
          <img src={ualrLogo} alt="UALR Logo" />
        </div>
        <div className="input-container">
          <img src={userLogo} alt="User Logo" />
          <div className="input-text">
            <p>Email address / Username</p>
            <input
              className="login-form-input-field"
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
          </div>
        </div>
        <div className="input-container">
          <img src={passLogo} alt="Pass Logo" />
          <div className="input-text">
            <p>Password</p>
            <input
              className="login-form-input-field"
              type="text"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </div>
        </div>
        <div className="login-form-checkbox-container">
          <input
            type="checkbox"
            checked={rememberBool}
            onChange={() => setRememberBool(!rememberBool)}
          />
          <p className="checkbox-text">Remember Me</p>
        </div>
        <div className="login-form-button-container">
          <button className="login-form-button login-form-button-primary">
            Sign In
          </button>
          <button className="login-form-button login-form-button-secondary">
            Register
          </button>
        </div>
      </div>
      {/*<img className="background-twirl-bottom" src={svg}/>*/}
    </div>
  );
};

export default LoginPage;
