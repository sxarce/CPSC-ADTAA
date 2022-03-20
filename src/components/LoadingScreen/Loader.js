import React from "react";
import "./Loader.css";


export default function Loader(props) {
  return (
    <div className="loader-wrapper">
      <p className="loading-text" style={{color: "#FFF"}}>
        Loading... Please wait.. If page fails to load, please refresh the page.
      </p>

      <span className="loader">
        <span className="loader-inner"></span>
      </span>
    </div>
  );
}
