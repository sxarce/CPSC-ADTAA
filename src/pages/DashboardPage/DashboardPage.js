import "./DashboardPage.css";
import React from "react";
import leftImg from "../../assets/svg/background_ellipse.svg";
import rightImg from "../../assets/svg/background_funky_shape.svg";
import gear from "../../assets/svg/gear.svg";
import peopleAssist from "../../assets/svg/people_assistance.svg";
import pencil from "../../assets/svg/pencil.svg";
import ualrLogo from "../../assets/svg/ualrLogo.svg";

export default function DashboardPage() {
  return (
    <div className="background">
      <img src={leftImg} alt="ellipse" className="left-img" />
      <img src={rightImg} alt="two circles" className="right-img" />
      <img src={ualrLogo} alt="ualr logo" className="ualr-logo-dashboard" />

      <div className="buttons-area">
        <button class="btn">
          <img src={gear} alt="gear icon" />
        </button>
        <button class="btn">
          <img src={peopleAssist} alt="assist icon" />
        </button>
        <button class="btn">
          <img src={pencil} alt="pencil icon" />
        </button>
      </div>
    </div>
  );
}
