import React from "react";
import "./RegisterPage.css";
import rect_left from "../../assets/svg/background_rectangle.svg";
import rect_right from "../../assets/svg/background_rectangle2.svg";
import ualrLogo from "../../assets/svg/uarLogoRed.svg";

import axios from "axios";
import { useRef, useState, useEffect } from "react";

/* MUI components */
import { Button } from "@mui/material";

import APIService from "../../components/APIService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
  // const [email, setEmail] = React.useState("");
  // const [username, setUsername] = React.useState("");
  // const [password, setPassword] = React.useState("");
  // const [passwordConfirm, setPasswordConfirm] = React.useState("");
  // const [accessLevel, setAccessLevel] = React.useState("");

  const [formData, setFormData] = React.useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    accessLevel: "",
  });
  // console.log(formData);

  const insertUser = () => {
    axios
      .post("http://localhost:5000/register-user", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleSubmit(e) {
    e.preventDefault();
    insertUser();
    setFormData({
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
      accessLevel: "",
    });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  /* FORM VALIDATION */
  const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const userRef = useRef();
  const errRef = useRef();

  const [validUsername, setValidUsername] = useState("false");
  const [validEmail, setValidEmail] = useState("false");
  const [userFocus, setUserFocus] = useState("false");
  const [validPwd, setValidPwd] = useState("false");
  const [pwdFocus, setPwdFocus] = useState("false");
  const [validMatch, setValidMatch] = useState("false");
  const [matchFocus, setMatchFocus] = useState("false");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const resultUsername = USERNAME_REGEX.test(formData.username);
    console.log(resultUsername);
    console.log(formData.username);
    setValidUsername(resultUsername);

    const resultEmail = EMAIL_REGEX.test(formData.email);
    setValidEmail(resultEmail);
  }, [formData]);

  useEffect(() => {
    setErrMsg("");
  }, [formData]);

  return (
    <div className="background-register">
      <img
        className="red-rectangle-left"
        src={rect_left}
        alt="left red rectangle"
      />
      <img
        className="red-rectangle-right"
        src={rect_right}
        alt="right red rectangle"
      />

      <img className="ualr-logo-red" src={ualrLogo} alt="ualr logo in red" />

      <div className="card">
        <section className="card-title">
          <h1 className="card-title-create">Create an account</h1>
          <p>Submit a registration request with your desired access level</p>
        </section>

        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form className="input-fields" onSubmit={handleSubmit}>
          <div className="input-fields-top">
            <div className="input-wrapper">
              <input
                type="email"
                className="input-field-email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="off"
                ref={userRef}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <span className="errspan">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "valid" : "hide"}
                />

                <FontAwesomeIcon
                  icon={faTimes}
                  color="red"
                  className={validEmail || !formData.email ? "hide" : "invalid"}
                />
              </span>
            </div>
            <select
              id="access-levels"
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              required
            >
              {/* <optgroup label="Access levels"> */}
                <option value="" disabled selected>
                  Access level
                </option>
                <option value="ROOT">Root User</option>
                <option value="ADMIN">Admin</option>
                <option value="ASSISTANT">Assistant</option>
              {/* </optgroup> */}
            </select>
          </div>
          {/* <p
            id="uidnote"
            style={{marginTop: "0rem"}}
            className={
              userFocus && formData.email && !validEmail
                ? "instructions"
                : "offscreen"
            }
            
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must be a valid email.
           
          </p> */}

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <span className="errspan">
              <FontAwesomeIcon
                icon={faCheck}
                className={validUsername ? "valid" : "hide"}
              />

              <FontAwesomeIcon
                icon={faTimes}
                color="red"
                className={
                  validUsername || !formData.username ? "hide" : "invalid"
                }
              />
            </span>
          </div>
          <p
            id="uidnote"
            className={
              userFocus && formData.username && !validUsername
                ? "instructions"
                : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            4 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </p>

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
          />
          <button className="register-btn">Create Account</button>

          <div className="sign-in-full-text">
            <span>Already Have An Account? </span>
            <span className="sign-in-text">Sign In</span>
          </div>
        </form>
      </div>
    </div>
  );
}
