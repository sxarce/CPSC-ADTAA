import React from "react";
import axios from "axios";
import Loader from "../../components/LoadingScreen/Loader";
import { Navigate } from "react-router-dom";

import assistantBackground from "../../assets/svg/background_assistant.svg";
import Sidebar from "../../components/Sidebar";
import "./AssistantPage.css";

import Controls from "../../components/Forms/SectionForm/controls/Controls";

export default function AssistantPage(props) {
  document.title = "Assistant - ADTAA";
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
          //   localStorage.removeItem("token");
          props.removeToken(); // logout upon failure to verify credentials. Token expired.
        }
      });
  }, []);

  const [testData, setTestData] = React.useState(null);
  const generateSchedules = () => {
    console.log("Clicked! Generating schedule...");
    axios
      .post("/generate-schedule")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  // reminder: last return is equivalent to "else return"
  if (loading === true) return <Loader message={""} />;
  else if (credentials === undefined || credentials === null) {
    return (
      <Loader message={"Authentication failed. Please refresh the page"} />
    );
  }
  return (
    <div className="background-assistant">
      <div className="banner-assistant">
        <img
          src={assistantBackground}
          alt="assistant logo"
          className="assistant-background"
        />
      </div>

      <Sidebar
        page="assistant"
        accessLevel={credentials.user_access_level}
        email={credentials.user_email}
        logout={props.removeToken}
      />

      <div className="table-container-assistant">
        <Controls.Button
          variant="contained"
          color="primary"
          text="Generate schedule (TEST ONLY)"
          handleClick={generateSchedules}
        />
        <section className="test">{testData}</section>
      </div>
    </div>
  );
}
