import React from "react";
import "./SetupPage.css";
import Sidebar from "../../components/Sidebar"
import gearBackground from "../../assets/svg/background_gear.svg";

export default function SetupPage() {
  return (
    <div className="background-setup">
      <div className="banner">
        <img src={gearBackground} alt="gear logo" className="gear-background" />
      </div>
      
      <Sidebar page="setup"/>
      
    </div>
  );
}
