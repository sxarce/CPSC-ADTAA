import React from "react";
import "./SetupSectionsPage.css";
import Sidebar from "../../components/Sidebar";

import gearBackground from "../../assets/svg/background_gear.svg";

import axios from "axios";

import Loader from "../../components/LoadingScreen/Loader";
import { Navigate } from "react-router-dom";

import SectionSetupTable from "../../components/Tables/SectionSetupTable";
import SectionsForm from "../../components/Forms/SectionForm/SectionsForm";

import useTable from "../../components/Tables/useTable";
import {
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Toolbar,
  InputAdornment,
} from "@mui/material";
import Controls from "../../components/Forms/SectionForm/controls/Controls";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@mui/styles";
import Popup from "../../components/Forms/Popup";
import { format } from "date-fns";

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

  const headerCells = [
    { id: "courseNumber", label: "Course #" },
    { id: "sectionNumber", label: "Section #" },
    { id: "numMeetingPeriods", label: "# of meeting periods" },
    {
      id: "meetingPeriod1Day",
      label: "Day 1",
      disableSorting: true,
    },
    {
      id: "meetingPeriod1Start",
      label: "Start 1",
      disableSorting: true,
    },
    {
      id: "meetingPeriod1End",
      label: "End 1",
      disableSorting: true,
    },
    {
      id: "meetingPeriod2Day",
      label: "Day 2",
      disableSorting: true,
    },
    {
      id: "meetingPeriod2Start",
      label: "Start 2",
      disableSorting: true,
    },
    {
      id: "meetingPeriod2End",
      label: "End 2",
      disableSorting: true,
    },
    {
      id: "meetingPeriod3Day",
      label: "Day 3",
      disableSorting: true,
    },
    {
      id: "meetingPeriod3Start",
      label: "Start 3",
      disableSorting: true,
    },
    {
      id: "meetingPeriod3End",
      label: "End 3",
      disableSorting: true,
    },
  ];

  const useStyles = makeStyles({
    pageContent: {
      margin: "40px",
      padding: "24px",
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
    newButton: {
      position: "absolute !important",
      right: "10px",
    },
    startIcon: {
      margin: "0px",
    },
  });
  const classes = useStyles();

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = React.useState(false);
  const [records, setRecords] = React.useState(); // tableData

  React.useEffect(() => {
    axios
      .get("/get-sections")
      .then((response) => {
        console.log(response);
        let retrievedTableData = response.data.TableData;
        setRecords(retrievedTableData);
      })
      .catch((error) => console.log(error));
  }, []);

  const {
    TableContainer,
    TableHeader,
    TablePagination,
    recordsAfterPagingAndSorting,
  } = useTable(records, headerCells, filterFn);

  function handleSearch(event) {
    let target = event.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") {
          return items;
        } else
          return items.filter((item) =>
            item.courseNumber.toString().includes(target.value)
          );
      },
    });
    // console.log(target.value)
  }

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
    <div className="background-setup-sections">
      <div className="banner-setup-sections">
        <img src={gearBackground} alt="gear logo" className="gear-background" />
      </div>

      <Sidebar
        page="setup-sections"
        accessLevel={credentials.user_access_level}
        email={credentials.user_email}
        logout={props.removeToken}
      />

      <div className="table-container-setup-sections">
        {/* <SectionSetupTable token={props.token} setToken={props.setToken} /> */}

        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              label="Search by course #"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              handleChange={handleSearch}
            />
            <Controls.Button
              variant="contained"
              text="Add section"
              // classes={{startIcon: classes.startIcon}}
              style={{ position: "absolute", right: "30px" }}
              startIcon={<AddIcon />}
              color="primary"
              handleClick={() => setOpenPopup(true)}
            />
          </Toolbar>
          <TableContainer>
            <TableHeader />
            <TableBody>
              {recordsAfterPagingAndSorting().map((elem) => (
                <TableRow key={elem.id}>
                  <TableCell style={{width: "6vw"}}>{elem.courseNumber}</TableCell>
                  <TableCell style={{width: "6vw"}}>{elem.sectionNumber}</TableCell>
                  <TableCell style={{width: "7vw"}}>{elem.meetingPeriods.length}</TableCell>
                  {elem.meetingPeriods.map((meetingPeriod) => (
                    <>
                      <TableCell>{meetingPeriod.meetDay}</TableCell>
                      <TableCell>
                        {format(new Date(meetingPeriod.startTime), "HH:mm")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(meetingPeriod.endTime), "HH:mm")}
                      </TableCell>
                    </>
                  ))}
                  {elem.meetingPeriods.length <= 2 && (
                    <>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </>
                  )}
                  {/* <TableCell>{elem.numMeetingPeriods}</TableCell> */}
                  {/* <TableCell>{elem.meetingPeriod1Day}</TableCell>
                  <TableCell>{elem.meetingPeriod1Start}</TableCell>
                  <TableCell>{elem.meetingPeriod1End}</TableCell>
                  <TableCell>{elem.meetingPeriod2Day}</TableCell>
                  <TableCell>{elem.meetingPeriod2Start}</TableCell>
                  <TableCell>{elem.meetingPeriod2End}</TableCell>
                  <TableCell>{elem.meetingPeriod3Day}</TableCell>
                  <TableCell>{elem.meetingPeriod3Start}</TableCell>
                  <TableCell>{elem.meetingPeriod3End}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
          <TablePagination />
        </Paper>
        <Popup
          title="Add section"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <SectionsForm
            token={props.token}
            setToken={props.setToken}
            setRecords={setRecords}
          />
        </Popup>
      </div>
    </div>
  );
}

// const records = [
//   {
//     id: "1",
//     courseNumber: "2345",
//     sectionNumber: "1",
//     numMeetingPeriods: "2",
//     meetingPeriod1Day: "Monday",
//     meetingPeriod1Start: "9:30",
//     meetingPeriod1End: "11:30",
//   },
//   {
//     id: "2",
//     courseNumber: "6789",
//     sectionNumber: "2",
//     numMeetingPeriods: "3",
//     meetingPeriod1Day: "Tuesday",
//     meetingPeriod1Start: "9:30",
//     meetingPeriod1End: "11:30",
//   },
//   {
//     id: "3",
//     courseNumber: "abcd",
//     sectionNumber: "3 ",
//     numMeetingPeriods: "3",
//     meetingPeriod1Day: "Tuesday",
//     meetingPeriod1Start: "9:30",
//     meetingPeriod1End: "11:30",
//   },
//   {
//     id: "4",
//     courseNumber: "asda",
//     sectionNumber: "4",
//     numMeetingPeriods: "3",
//     meetingPeriod1Day: "Tuesday",
//     meetingPeriod1Start: "9:30",
//     meetingPeriod1End: "11:30",
//   },
//   {
//     id: "5",
//     courseNumber: "hghc",
//     sectionNumber: "5",
//     numMeetingPeriods: "3",
//     meetingPeriod1Day: "Tuesday",
//     meetingPeriod1Start: "9:30",
//     meetingPeriod1End: "11:30",
//   },
//   {
//     id: "6",
//     courseNumber: "cvxc",
//     sectionNumber: "1",
//     numMeetingPeriods: "3",
//     meetingPeriod1Day: "Tuesday",
//     meetingPeriod1Start: "9:30",
//     meetingPeriod1End: "11:30",
//   },
//   {
//     id: "7",
//     courseNumber: "kjjk",
//     sectionNumber: "4",
//     numMeetingPeriods: "3",
//     meetingPeriod1Day: "Tuesday",
//     meetingPeriod1Start: "9:30",
//     meetingPeriod1End: "11:30",
//     meetingPeriod2Day: "Tuesday",
//     meetingPeriod2Start: "9:30",
//     meetingPeriod2End: "11:30",
//     meetingPeriod3Day: "Tuesday",
//     meetingPeriod3Start: "9:30",
//     meetingPeriod3End: "11:30",
//   },
//   {
//     id: "8",
//     courseNumber: "mmbn",
//     sectionNumber: "3",
//     numMeetingPeriods: "3",
//     meetingPeriod1Day: "Tuesday",
//     meetingPeriod1Start: "9:30",
//     meetingPeriod1End: "11:30",
//   },
// ];
