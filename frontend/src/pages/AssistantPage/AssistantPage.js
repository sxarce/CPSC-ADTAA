import React from "react";
import axios from "axios";
import Loader from "../../components/LoadingScreen/Loader";
import { Navigate } from "react-router-dom";

import assistantBackground from "../../assets/svg/background_assistant.svg";
import Sidebar from "../../components/Sidebar";
import "./AssistantPage.css";

import Controls from "../../components/Forms/SectionForm/controls/Controls";
import {
  InputAdornment,
  Paper,
  Toolbar,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Tooltip,
} from "@mui/material";
import useTable from "../../components/Tables/useTable";

import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";

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
        // console.log(response);
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
          props.removeToken(); // logout upon failure to verify credentials. Token expired.
        }
      });
  }, []);

  const [tableData, setTableData] = React.useState(null);
  // console.log(tableData);

  const generateSchedules = () => {
    console.log("Clicked! Generating schedule...");
    axios
      .post("/generate-schedule")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  const getSchedules = () => {
    console.log("Getting schedules");
    axios
      .get("/get-schedules")
      .then((response) => {
        console.log(response);
        let retrievedTableData = response.data.TableData;
        if (retrievedTableData.length > 0) {
          setTableData(retrievedTableData[0].assignedClasses); // retrievedTableData[0].assignedClasses
        } else setTableData(retrievedTableData);
      })
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    getSchedules();
  }, []);

  const headerCells = [
    { id: "courseNumber", label: "Course #" },
    { id: "sectionNumber", label: "Section #" },
    { id: "instructorName", label: "Instructor Name" },
    { id: "commonDisciplineAreas", label: "Common discipline areas" },
  ];
  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  const {
    TableContainer,
    TableHeader,
    TablePagination,
    tableDataAfterPagingAndSorting,
  } = useTable(tableData, headerCells, filterFn);

  function handleSearch(event) {
    let target = event.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") {
          return items;
        } else
          return items.filter((item) =>
            item.assigned_instructor.lastName
              .toString()
              .toLowerCase()
              .includes(target.value.toLowerCase())
          );
      },
    });
    // console.log(target.value)
  }

  const useStyles = makeStyles({
    pageContent: {
      margin: "40px",
      padding: "24px",
      width: "75vw", // Table is at 100%. 100% of Paper (77vw)
    },
    searchInput: {
      width: "65%",
      "& label.Mui-focused": {
        color: "#732d40",
      },
      "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
          borderColor: "#732d40",
        },
      },
    },
  });
  const classes = useStyles();

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

      <div style={{ display: "flex" }}>
        <Controls.Button
          variant="contained"
          color="primary"
          text="Generate schedule (TEST ONLY)"
          handleClick={generateSchedules}
          // disabled
        />
        <Controls.Button
          variant="contained"
          color="primary"
          text="GET schedule (TEST ONLY)"
          handleClick={getSchedules}
        />
      </div>

      <div className="table-container-assistant">
        {/* <section className="test">{testData}</section> */}
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              label="Search by instructor's last name"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              handleChange={handleSearch}
            />
          </Toolbar>

          <TableContainer>
            <TableHeader />
            <TableBody>
              {tableDataAfterPagingAndSorting().map((elem) => {
                // console.log(elem);
                return (
                  <TableRow key={elem.id}>
                    <TableCell style={{ width: "0px", fontWeight: "bold" }}>
                      <Tooltip title={elem.assigned_section.course_info.name} placement="right">
                        <span>{elem.assigned_section.course_info.number}</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell style={{ width: "0px" }}>
                      {elem.assigned_section.sectionNumber}
                    </TableCell>
                    <TableCell style={{ width: "0px" }}>
                      {`${elem.assigned_instructor.lastName}, ${elem.assigned_instructor.firstName}`}
                    </TableCell>
                    <TableCell style={{ width: "0px" }}>
                      {/* {() => {
                        let instructorDisciplineAreas = elem.assigned_instructor.disciplineAreas
                        let courseDisciplineAreas = elem.assigned_section.course_info.disciplineAreas


                      }} */}
                      {elem.assigned_instructor.disciplineAreas
                        .filter((item) =>
                          elem.assigned_section.course_info.disciplineAreas.some(
                            ({ name }) => item.name === name
                          )
                        )
                        .map((listItem) => (
                          <li>{listItem.name}</li>
                        ))}
                      {/* {elem.assigned_section.course_info.disciplineAreas.map(x => (<li>{x.name}</li>))} */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </TableContainer>
          <TablePagination />
        </Paper>
      </div>
    </div>
  );
}
