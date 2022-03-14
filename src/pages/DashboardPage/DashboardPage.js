import "./DashboardPage.css";
import React from "react";
import leftImg from "../../assets/svg/background_ellipse.svg";
import rightImg from "../../assets/svg/background_funky_shape.svg";
import gear from "../../assets/svg/gear.svg";
import peopleAssist from "../../assets/svg/people_assistance.svg";
import pencil from "../../assets/svg/pencil.svg";
import ualrLogo from "../../assets/svg/ualrLogo.svg";
import { useNavigate } from "react-router-dom";

/* MUI components */
import { Button } from "@mui/material";

export default function DashboardPage() {
  let navigate = useNavigate();

  return (
    <div className="background-dashboard">
      <img src={leftImg} alt="ellipse" className="left-img-dashboard" />
      <img src={rightImg} alt="two circles" className="right-img-dashboard" />
      <img src={ualrLogo} alt="ualr logo" className="ualr-logo-dashboard" />

      <div className="buttons-area">
      
        <Button className="btn" onClick={() => navigate("/setup")} >
          <img src={gear} alt="gear icon" />
        </Button>
        <Button className="btn" onClick={() => navigate("/assistant")}>
          <img src={peopleAssist} alt="assist icon" />
        </Button>
        <Button className="btn" onClick={() => navigate("/edit")}>
          <img src={pencil} alt="pencil icon" />
        </Button>
      </div>
    </div>
  );
}
