import "./Sidebar.css";

import React from "react";
import monitorImg from "../assets/svg/sidebar/sidebar_monitor.svg";
import gearImg from "../assets/svg/sidebar/sidebar_gear.svg";
import assistImg from "../assets/svg/sidebar/sidebar_assist.svg";
import pencilImg from "../assets/svg/sidebar/sidebar_pencil.svg";
import personImg from "../assets/svg/sidebar/sidebar_person.svg";
import ualrLogo from "../assets/svg/sidebar/sidebar_ualr.svg";

import {Link} from "react-router-dom"
export default function Sidebar(props) {
  return (
    <div className="sidebar">
      <ul className="sidebar-items">
        <li>
          <img src={monitorImg} alt="monitor icon" />
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={`${props.page === "setup" ? "sidebar-current-page" : ""}`}>
          <img src={gearImg} alt="gear icon" />
          <Link to="/setup">Setup</Link>
        </li>
        <li className={`${props.page === "edit" ? "sidebar-current-page" : ""}`}>
          <img src={pencilImg} alt="pencil icon" />
          <Link to="/edit">Edit</Link>
        </li>
        <li className={`${props.page === "assistant" ? "sidebar-current-page" : ""}`}>
          <img src={assistImg} alt="icon of people carrying box" />
          <Link to="/assistant">Assistant</Link>
        </li>
        <li className={`${props.page === "regRequests" ? "sidebar-current-page" : ""}`}>
          <img src={personImg} alt="person icon" />
          <Link to="/registration-requests">Registration requests</Link>
        </li>
      </ul>

      <hr className="solid-line-sidebar-divider" />

      <img src={ualrLogo} alt="ualr logo" className="sidebar-ualr-logo" />
    </div>
  );
}
