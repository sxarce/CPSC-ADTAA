import "./LoginPage.css";
import leftImg from "../../assets/svg/background_twirl.svg";
import rightImg from "../../assets/svg/background_twirl2.svg";
import ualrLogo from "../../assets/svg/ualrLogo.svg";
import ellipse from "../../assets/svg/ellipse.svg";
import userLogo from "../../assets/svg/briefcase.svg";
import passLogo from "../../assets/svg/lock.svg";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rememberBool, setRememberBool] = useState(false);

  let navigate = useNavigate()
  function routeChange() {
    let path = "/register"
    navigate(path)
  }
  return (
    //   <div className="login-page-container">
    //     <img className="background-twirl" src={svg} />
    //     <div className="login-form-container">
    //       <div className="login-form-title">
    //         <h1 className="login-form-header-text">Sign Into Your Account</h1>
    //         <img src={ualrLogo} alt="UALR Logo" />
    //       </div>
    //       <div className="input-container">
    //         <img src={userLogo} alt="User Logo" />
    //         <div className="input-text">
    //           <p>Email address / Username</p>
    //           <input
    //             className="login-form-input-field"
    //             type="text"
    //             value={usernameInput}
    //             onChange={(e) => setUsernameInput(e.target.value)}
    //           />
    //         </div>
    //       </div>
    //       <div className="input-container">
    //         <img src={passLogo} alt="Pass Logo" />
    //         <div className="input-text">
    //           <p>Password</p>
    //           <input
    //             className="login-form-input-field"
    //             type="text"
    //             value={passwordInput}
    //             onChange={(e) => setPasswordInput(e.target.value)}
    //           />
    //         </div>
    //       </div>
    //       <div className="login-form-checkbox-container">
    //         <input
    //           type="checkbox"
    //           checked={rememberBool}
    //           onChange={() => setRememberBool(!rememberBool)}
    //         />
    //         <p className="checkbox-text">Remember Me</p>
    //       </div>
    //       <div className="login-form-button-container">
    //         <button className="login-form-button login-form-button-primary">
    //           Sign In
    //         </button>
    //         <button className="login-form-button login-form-button-secondary">
    //           Register
    //         </button>
    //       </div>
    //     </div>
    //     {/*<img className="background-twirl-bottom" src={svg}/>*/}
    //   </div>
    // );
    <div className="background">
      <img className="left-img" src={leftImg} alt="left design" />
      <img className="right-img" src={rightImg} alt="right design" />
      <img className="ualr-logo" src={ualrLogo} alt="ualr logo" />
      <img className="ellipse" src={ellipse} alt="ellipse" />

      <section className="sign-in">
        <div className="sign-in-title">
          <p>Sign Into </p>
          <p>Your Account</p>
        </div>

        <div className="sign-in-fields">
          <div className="sign-in-areas">
            <img src={userLogo} />
            <div className="wrapper">
              <label for="email">Email address / Username</label>
              <br />
              <input className="field" type="text" name="email" />
            </div>
          </div>

          <div className="sign-in-areas">
            <img src={passLogo} />
            <div className="wrapper">
              <label for="password">Password</label>
              <br />
              <input className="field" type="text" name="password" />
            </div>
          </div>
          <div className="sign-in-areas">
            <input
              type="checkbox"
              name="Remember me"
              value="remember"
              id="remember"
            />
            <label for="Remember me">Remember me</label>
          </div>

          <div className="button-areas">
            <button className="sign-in-button">Sign in</button>
            <button className="register-button" onClick={routeChange}>Register</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
