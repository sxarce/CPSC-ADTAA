import "./DashboardPage.css";
import React from "react";
import leftImg from "../../assets/svg/background_ellipse.svg";
import rightImg from "../../assets/svg/background_funky_shape.svg";
import gear from "../../assets/svg/gear.svg";
import peopleAssist from "../../assets/svg/people_assistance.svg";
import pencil from "../../assets/svg/pencil.svg";
import ualrLogo from "../../assets/svg/ualrLogo.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/* MUI components */
import { Button } from "@mui/material";

import axios from "axios";
import Loader from "../../components/LoadingScreen/Loader";

export default function DashboardPage(props) {
  // For <Loader />
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const [credentials, setCredentials] = useState(null);
  let navigate = useNavigate();
  useEffect(() => {
    getData();
    // testProtected()
  }, []);

  function getData() {
    axios
      .get("/credentials", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        console.log(response);
        const data = response.data;
        data.access_token && props.setToken(data.access_token);
        setCredentials({
          user_email: data.email,
          user_access_level: data.accessLevel,
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          localStorage.removeItem("token");
        }
      });
  }
  console.log(credentials);

  if (loading === true) return <Loader message={""} />;
  else if (credentials === undefined || credentials === null)
    return <Loader message={"Authentication failed. Please refresh the page"} />;
  return (
    <div className="background-dashboard">
      <img src={leftImg} alt="ellipse" className="left-img-dashboard" />
      <img src={rightImg} alt="two circles" className="right-img-dashboard" />
      <img src={ualrLogo} alt="ualr logo" className="ualr-logo-dashboard" />

      <div className="buttons-area">
        <Button
          className={`btn ${
            credentials.user_access_level !== "ROOT" &&
            credentials.user_access_level !== "ADMIN"
              ? "hide-button"
              : ""
          }`}
          onClick={() => navigate("/setup")}
        >
          <img src={gear} alt="gear icon" />
        </Button>
        <Button className="btn" onClick={() => navigate("/assistant")}>
          <img src={peopleAssist} alt="assist icon" />
        </Button>
        <Button
          className={`btn ${
            credentials.user_access_level !== "ROOT" &&
            credentials.user_access_level !== "ADMIN"
              ? "hide-button"
              : ""
          }`}
          onClick={() => navigate("/edit")}
        >
          <img src={pencil} alt="pencil icon" />
        </Button>
      </div>
    </div>
  );
}
