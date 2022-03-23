import React, { useEffect } from "react";
import "./RegRequestsPage.css";
import userBackground from "../../assets/svg/background_user.svg";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

export default function RegRequestsPage(props) {
  const [tableData, setTableData] = React.useState([]);
  const [credentials, setCredentials] = React.useState(null);

  function setRegistrationStatus(isApproved, user_email) {
    axios
      .post(
        "/set-registration-status",
        JSON.stringify({
          email: user_email,
          isApproved: isApproved,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const data = response.data;
        data.access_token && props.setToken(data.access_token);
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("token");
      });
  }

  useEffect(() => {
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

    axios
      .get("/get-registration-requests", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        console.log(response);
        const data = response.data;
        data.access_token && props.setToken(data.access_token);
        setTableData(data.validUsers);
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("token");
      });
  }, []);

  if (credentials === null || credentials === undefined) return <p>Credentials undefined</p>
  else if (credentials.user_access_level !== "ROOT") return <p>Access Level must be ROOT. Not authorized.</p>
  return (
    <div className="background-requests">
      <div className="banner">
        <img src={userBackground} alt="gear logo" className="gear-background" />
      </div>

      <Sidebar page="regRequests" />
      <div className="table-container" style={{ top: "25%" }}>
        {/* <button onClick={getRegisterRequests}>temp button</button> */}
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email Address</th>
              <th>Requested Access Level</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((user) => {
              return (
                <tr>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.accessLevel}</td>
                  <td>
                    <button
                      onClick={() => setRegistrationStatus(true, user.email)}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRegistrationStatus(false, user.email)}
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
