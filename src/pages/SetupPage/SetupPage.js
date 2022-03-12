import React from "react";
import "./SetupPage.css";
import monitorImg from "../../assets/svg/sidebar/sidebar_monitor.svg";
import gearImg from "../../assets/svg/sidebar/sidebar_gear.svg";
import assistImg from "../../assets/svg/sidebar/sidebar_assist.svg";
import pencilImg from "../../assets/svg/sidebar/sidebar_pencil.svg";
import personImg from "../../assets/svg/sidebar/sidebar_person.svg";
import ualrLogo from "../../assets/svg/sidebar/sidebar_ualr.svg";
import gearBackground from "../../assets/svg/background_gear.svg";

export default function SetupPage() {
  return (
    <div className="background-setup">
      <div className="banner">
        <img src={gearBackground} alt="gear logo" className="gear-background" />
      </div>
      <div className="sidebar">
        <ul className="sidebar-items">
          <li>
            <img src={monitorImg} alt="monitor icon" />
            <a href="">Dashboard</a>
          </li>
          <li>
            <img src={gearImg} alt="gear icon" />
            <a href="">Setup</a>
          </li>
          <li>
            <img src={pencilImg} alt="pencil icon" />
            <a href="">Edit</a>
          </li>
          <li>
            <img src={assistImg} alt="icon of people carrying box" />
            <a href="">Assistant</a>
          </li>
          <li>
            <img src={personImg} alt="person icon" />
            <a href="">Registration requests</a>
          </li>
        </ul>

        <hr className="solid-line-sidebar-divider" />

        <img src={ualrLogo} alt="ualr logo" className="sidebar-ualr-logo" />
      </div>
    </div>
  );
}
