import React, { useEffect } from "react";
import "./RegRequestsPage.css";
import userBackground from "../../assets/svg/background_user.svg";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

export default function RegRequestsPage(props) {
  // {headers: {Authorization: "Bearer " + props.token}}
  const [tableData, setTableData] = React.useState([]);

  function setRegistrationStatus(isApproved, user_email) {
    axios.post(
      "/set-registration-status",
      JSON.stringify({
        email: user_email,
        isApproved: isApproved,
      }),
      { headers: { "Content-Type": "application/json"} }
    )
    .then(response => console.log(response))
    .catch(error => console.log(error));
  }

  useEffect(() =>  {
    axios
      .get("/get-registration-requests")
      .then((response) => {
        console.log(response);
        const data = response.data;
        setTableData(data.validUsers);
      })
      .catch((error) => console.log(error));
  }, [])
  
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
