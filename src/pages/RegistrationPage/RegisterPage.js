import React from "react";
import "./RegisterPage.css";
import rect_left from "../../assets/svg/background_rectangle.svg";
import rect_right from "../../assets/svg/background_rectangle2.svg";
import ualrLogo from "../../assets/svg/uarLogoRed.svg";

export default function RegisterPage() {
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

        <form className="input-fields">
          <div className="input-fields-top">
            <input
              type="text"
              className="input-field-email"
              placeholder="Email Address"
            />
            <select name="access-levels" id="access-levels">
              <optgroup label="Access levels">
                <option value="" disabled selected>
                  Access level
                </option>
                <option value="ROOT">Root User</option>
                <option value="ADMIN">Admin</option>
                <option value="ASSISTANT">Assistant</option>
              </optgroup>
            </select>
          </div>

          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Password" />
          <input type="text" placeholder="Confirm password" />
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
