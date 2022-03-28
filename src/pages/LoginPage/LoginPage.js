import "./LoginPage.css";
import leftImg from "../../assets/svg/background_twirl.svg";
import rightImg from "../../assets/svg/background_twirl2.svg";
import ualrLogo from "../../assets/svg/ualrLogo.svg";
import ellipse from "../../assets/svg/ellipse.svg";
import userLogo from "../../assets/svg/briefcase.svg";
import passLogo from "../../assets/svg/lock.svg";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@mui/material";
import axios from "axios";
// import { makeStyles } from "@mui/styles";

import { animated, useSpring } from "react-spring";

const LoginPage = (props) => {
  // TEST ONLY: sends ONE email upon visiting the website.
  // useEffect(() => {
  //   axios.get("/send-email")
  //   .then(response => console.log(response))
  //   .catch(error => console.log(error))
  // }, [])

  const loginUser = (e) => {
    axios
      .post(
        "/login-user",
        JSON.stringify({
          username: formData.usernameInput,
          password: formData.passwordInput,
        }),
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        return props.setToken(response.data.access_token);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  function handleSubmit(e) {
    e.preventDefault();
    loginUser();

    setFormData({
      usernameInput: "",
      passwordInput: "",
      rememberBool: false,
    });
  }

  const [formData, setFormData] = useState({
    usernameInput: "",
    passwordInput: "",
    rememberBool: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => {
      return {
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }
  // console.log(formData)

  let navigate = useNavigate();
  function routeChange(e) {
    let path = "/register";
    navigate(path);
  }

  // Alternative way to make styles for button
  // const useStyles = makeStyles({
  //   sign_in_button: {
  //     color: "#FFFFFF !important",
  //     background: "linear-gradient(90.17deg, #7e3e4f 0.19%, #ab818d 99.77%)",
  //     textTransform: "none !important"
  //   }
  // });
  // console.log(useStyles)

  // function SignInButton(){
  //   const styles = useStyles();
  //   return (
  //     <Button className={styles.sign_in_button}>Sign in</Button>
  //   )
  // }
  const fadeInAnimationStyle = useSpring({
    to: { opacity: 1 },
    from: { opacity: -1 },
    config: { duration: 2500 },
  });
  return (
    <animated.div className="background" style={fadeInAnimationStyle}>
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
          <form onSubmit={handleSubmit}>
            <div className="sign-in-areas">
              <img src={userLogo} alt="briefcase" />
              <div className="wrapper">
                <label htmlFor="email">Email address / Username</label>
                <br />
                <input
                  className="field"
                  type="text"
                  name="usernameInput"
                  value={formData.usernameInput}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sign-in-areas">
              <img src={passLogo} />
              <div className="wrapper">
                <label htmlFor="password">Password</label>
                <br />
                <input
                  className="field"
                  type="password"
                  name="passwordInput"
                  value={formData.passwordInput}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="sign-in-areas">
              <input
                id="remember"
                type="checkbox"
                name="rememberBool"
                checked={formData.rememberBool}
                onChange={handleChange}
              />
              <label htmlFor="Remember me">Remember me</label>
            </div>

            <div className="button-areas">
              {/* <Button className="sign-in-button">Sign in</Button> */}
              <Button
                className="sign-in-button"
                type="submit"
                disabled={
                  formData.usernameInput === "" || formData.passwordInput === ""
                }
              >
                Sign in
              </Button>
              <button className="register-button" onClick={routeChange}>
                Register
              </button>
            </div>
          </form>
        </div>
      </section>
    </animated.div>
  );
};

export default LoginPage;

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
