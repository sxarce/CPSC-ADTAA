import React from "react";
import "./SetupPage.css";
import Sidebar from "../../components/Sidebar";
import InstructorSetupTable from "../../components/Tables/InstructorSetupTable";
import gearBackground from "../../assets/svg/background_gear.svg";

import axios from "axios";

import Loader from "../../components/LoadingScreen/Loader";
import { Navigate } from "react-router-dom";

export default function SetupPage(props) {
  const [loading, setLoading] = React.useState(true); // For <Loader />

  const [credentials, setCredentials] = React.useState(null);
  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);

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
          setCredentials(null);
          localStorage.removeItem("token");
        }
      });
  }, []);

  if (loading === true) return <Loader message={""} />;
  else if (credentials === undefined || credentials === null) {
    return (
      <Loader message={"Authentication failed. Please refresh the page"} />
    );
  } else if (
    credentials.user_access_level !== "ROOT" &&
    credentials.user_access_level !== "ADMIN"
  ) {
    // handles going to page via URL and unauthorized access.
    return <Navigate replace to="/dashboard" />;
  }
  return (
    <div className="background-setup">
    
      <div className="banner">
        <img src={gearBackground} alt="gear logo" className="gear-background" />
      </div>

      <Sidebar
        page="setup"
        accessLevel={credentials.user_access_level}
        email={credentials.user_email}
      />

      <div className="table-container" style={{ maxHeight: "100vh" }}>
        <InstructorSetupTable />
      </div>
    
    </div>
  );
}

// else if (credentials === undefined || credentials === null)
//   // handles tampering using localStorage.setItem("token") and localStorage.removeItem("token")
//   return (
//     <Loader message={"Authentication failed. Please refresh the page"} />
//   );
