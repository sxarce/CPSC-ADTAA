import React from "react";
import "./Loader.css";


export default function Loader(props) {
  return (
    <div className="loader-wrapper">
      <p className="loading-text" style={{color: "#FFF"}}>
        {props.message}
      </p>

      <span className="loader">
        <span className="loader-inner"></span>
      </span>
    </div>
  );
}
