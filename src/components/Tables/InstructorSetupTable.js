import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

import "./InstructorSetupTable.css";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

import { TextField } from "@mui/material";
// import { makeStyles } from "@mui/styles";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

import Tooltip from "@mui/material/Tooltip";

import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// TODO: Put in a constants file and import here.
const recognizedDisciplineAreas = [
  "Software Engineering",
  "Programming",
  "Artificial Intelligence",
  "Algorithms",
  "UI Design",
  "Computer Architecture",
  "Mobile apps development",
  "Database structures and design",
];

function getStyles(name, disciplineAreas, theme) {
  return {
    fontWeight:
      disciplineAreas.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    // fontSize: "x-small",
  };
}

export default function CustomPaginationActionsTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [tableData, setTableData] = React.useState([]);
  // console.log(tableData);
  const [instructorName, setInstructorName] = React.useState({
    lastNameInput: "",
    firstNameInput: "",
  });
  const [disciplineAreas, setDisciplineAreas] = React.useState([]);

  // <FORM VALIDATION>
  const [validFirstName, setValidFirstName] = React.useState(false);
  const [firstNameFocus, setFirstNameFocus] = React.useState(false);

  const [validLastName, setValidLastName] = React.useState(false);
  const [lastNameFocus, setLastNameFocus] = React.useState(false);

  const [validDisciplineAreas, setValidDisciplineAreas] = React.useState(false);
  const [disciplineAreasFocus, setDisciplineAreasFocus] = React.useState(false);

  // Last name validation
  React.useEffect(() => {
    const resultLastName = instructorName.lastNameInput === "" ? false : true;
    setValidLastName(resultLastName);
  }, [instructorName.lastNameInput]);

  // First name validation
  React.useEffect(() => {
    const resultFirstName = instructorName.firstNameInput === "" ? false : true;
    setValidFirstName(resultFirstName);
  }, [instructorName.firstNameInput]);

  // Discipline areas validation
  React.useEffect(() => {
    const resultDisciplineAreas = disciplineAreas.length <= 0 ? false : true;
    setValidDisciplineAreas(resultDisciplineAreas);
  }, [disciplineAreas]);

  // </FORM VALIDATION>

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const HeaderStyle = {
    fontWeight: "bold",
    borderBottom: "none",
    // fontFamily: "Open Sans",
    color: "#8898AA",
  };
  const HeaderBackgroundStyle = {
    backgroundColor: "#F6F9FC",
    borderBottom: "1px solid #E9ECEF",
    borderTop: "1px solid #E9ECEF",
  };

  function deleteInstructor(event, lastName, firstName) {
    axios
      .post(
        "/delete-instructor",
        JSON.stringify({
          instructorLastName: lastName,
          instructorFirstName: firstName,
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

    setTableData((prevTableData) => {
      const indexToDelete = tableData.findIndex(
        (element) =>
          element.lastName === lastName && element.firstName === firstName
      );
      prevTableData.splice(indexToDelete, 1);
      return prevTableData;
    });

    console.log(tableData);
  }

  function saveCurrentTable(instructorIndex) {
    // console.log(tableData.lastName);
    axios
      .post(
        "/add-instructor",
        {
          tableData: tableData,
          editInstructorID: editInstructorID,
          instructorToEditIndex: instructorIndex,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      )
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  function addInstructor(event) {
    // console.log(event);
    const rowsInput = {
      lastName: "",
      firstName: "",
      expertise: [],
    };

    setTableData((prevTableData) => [...prevTableData, rowsInput]);
  }

  // saveInstructor is badly written.
  // It combines two responsibilities in one and runs in conjunction with a helper method called saveCurrentTable that also does the same.
  function saveInstructor(event) {
    // for some reason, setTableData does not force a re-render. Other state need to reset.
    // this might be due to the fact that setState in useState hook is async.
    // Solution: Promise.resolve().then() -----> this behaves as if it's doing all setStates() synchronously.
    // SOURCE: https://stackoverflow.com/questions/53048495/does-react-batch-state-update-functions-when-using-hooks

    let indexOfNewInstructor = tableData.findIndex(
      (instructor) =>
        instructor.lastName === "" &&
        instructor.firstName === "" &&
        !instructor.expertise.length
    );

    // If editing instructor (findIndex returns -1 if element not found. NOT related to default value of editInstructorID)
    if (indexOfNewInstructor === -1) {
      indexOfNewInstructor = tableData.findIndex(
        (instructor) => instructor.id === editInstructorID
      );
    }
    console.log(indexOfNewInstructor);

    // EXPLANATION FOR EDIT MODE:
    // 1. Upon clicking the editBTN (pencil icon), the editInstructorID state changes. This controls conditional rendering (TextField vs. Text) and the actual logic in the "add-instructor" backend_route.
    // 2. A useEffect() hook calls editInstructor() and setEditMode() whenever the editInstructorID changes.
    // 3. setEditMode() triggers disable and enable of addInstructorBTN.
    // 4. editInstructor() changes the input states (instructorName and disciplineAreas) which is a way to dynamically set the default value of TextFields (since <TextField value={inputState} />)
    // 5. Finally, the saveBTN calls THIS FUNCTION you are in right now!
    // WHHHYY?
    // 5.1 Need to update "tableData" first since saveCurrentTable() and the "add-instructor" backend_route it goes to uses information from "tableData"
    // 5.2 It then calls getInstructorRoster() to update tableData from DB. This was added to retrieve the correct instructor_id that is automatically generated by SQLAlchemy.
    // 5.3 The id is not used in anything else EXCEPT IN editing rows. Without the correct instructorID, adding an instructor and clicking the corresponding
    // editBTN will provide an undefined value for editInstructorID which messes up Step 1.

    Promise.resolve().then(() => {
      setTableData((prevTableData) => {
        let newTableData = prevTableData;

        newTableData[indexOfNewInstructor] = {
          lastName: instructorName.lastNameInput,
          firstName: instructorName.firstNameInput,
          expertise: disciplineAreas,
        };

        return newTableData;
      });

      // console.log(tableData);
      saveCurrentTable(indexOfNewInstructor);
      getInstructorRoster();

      // clear state for inputs. back to defaults.
      setInstructorName({
        lastNameInput: "",
        firstNameInput: "",
      });
      setDisciplineAreas([]);

      // clear states for editing.
      setEditMode(false);
      setEditInstructorID(-1);
    });
    // setTableData((prevTableData) => {
    //   let newTableData = prevTableData;

    //   newTableData[indexOfNewInstructor] = {
    //     lastName: instructorName.lastNameInput,
    //     firstName: instructorName.firstNameInput,
    //     expertise: disciplineAreas,
    //   };
    //   // console.log(newTableData);
    //   return newTableData;
    // });

    // // console.log(tableData);
    // saveCurrentTable(indexOfNewInstructor);

    // // clear state for inputs. back to defaults.
    // setInstructorName({
    //   lastNameInput: "",
    //   firstNameInput: "",
    // });
    // setDisciplineAreas([]);

    // // clear edit
    // setEditMode(false)
    // setEditInstructorID(-1)
  }

  function handleInstructorInputChange(e) {
    const { name, value } = e.target;
    setInstructorName((prevInstructorName) => {
      return {
        ...prevInstructorName,
        [name]: value,
      };
    });

    console.log(instructorName);
  }

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setDisciplineAreas(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // const textFieldsBorderStyle = useStyles();
  const theme = useTheme();

  function getInstructorRoster() {
    axios
      .get("get-instructors-roster", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        let retrievedTableData = response.data.TableData;
        // console.log(retrievedTableData);

        /* 
          EXPLANATION FOR multiple use of Array.map() as seen below ---->
            backend returns more than what is necessary. (instructor_id might come in handy though)
            This was done via serialization through Marshmallow.Schema which exposed extra fields such as id.
            Error occurs when schema fields are left to one element (Must be a list or tuple)
            Potential solution: tuple("<name_of_field_here>")
        */

        setTableData(
          retrievedTableData.map((instructor) => {
            return {
              id: instructor.id,
              lastName: instructor.lastName,
              firstName: instructor.firstName,
              expertise: instructor.disciplineAreas.map(
                (disciplineArea) => disciplineArea.name
              ),
            };
          })
        );
      })
      .catch((error) => console.log(error));
  }
  React.useEffect(() => getInstructorRoster(), []);

  const [editInstructorID, setEditInstructorID] = React.useState(-1);
  const [editMode, setEditMode] = React.useState(false);

  // EDITING ROWS . States for editMode and editInstructorID
  console.log(`EditMode: ${editMode}, editInstructorID: ${editInstructorID}`);
  console.log(tableData);
  React.useEffect(() => {
    if (editInstructorID === -1) {
      // quick fix for initial render upon loading page. whatever results this may have, they're all unintended side-effects.
    } else {
      setEditMode(true);
      editInstructor(editInstructorID);
    }
  }, [editInstructorID]);

  function editInstructor(instructor_id) {
    let indexToEdit = tableData.findIndex(
      (instructor) => instructor.id === instructor_id
    );

    // For values inside textfields. a way of "dynamically setting defaultValue". Added for edit functionality.
    setInstructorName((prevInstructorName) => {
      return {
        firstNameInput: tableData[indexToEdit].firstName,
        lastNameInput: tableData[indexToEdit].lastName,
      };
    });

    // console.log(tableData[indexToEdit].expertise)
    setDisciplineAreas(tableData[indexToEdit].expertise);

    // console.log(indexToEdit);
  }

  // console.log(disciplineAreas)

  return (
    <TableContainer component={Paper} style={{ width: "77vw" }}>
      <ThemeProvider theme={theme}>
        <Table aria-label="Instructor table">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={3}
                style={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  padding: "1rem 1rem 1.3rem 1rem",
                }}
              >
                Current Roster
              </TableCell>
              <TableCell align="right" colSpan={2}>
                Instructors
              </TableCell>
            </TableRow>
            <TableRow style={HeaderBackgroundStyle}>
              <TableCell style={HeaderStyle}>Last Name</TableCell>
              <TableCell style={HeaderStyle}>First Name</TableCell>
              <TableCell style={HeaderStyle}>Expertise</TableCell>
              <TableCell
                style={{ width: "5rem" }}
                aria-label="btns-area"
              ></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? tableData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : tableData
            ).map((row) => {
              // console.log(row);
              return (
                <TableRow key={row.name}>
                  <TableCell className="last-name-text">
                    {row.lastName === "" || editInstructorID === row.id ? (
                      <TextField
                        variant="outlined"
                        name="lastNameInput"
                        label="last name"
                        style={{ width: "100%" }}
                        value={instructorName.lastNameInput}
                        onChange={handleInstructorInputChange}
                        autoFocus
                        onFocus={() => setLastNameFocus(true)}
                        onBlur={() => setLastNameFocus(false)}
                        error={!validLastName && lastNameFocus}
                        autoComplete="off"
                      />
                    ) : (
                      row.lastName
                    )}
                  </TableCell>
                  <TableCell>
                    {row.firstName === "" || editInstructorID === row.id ? (
                      <TextField
                        variant="outlined"
                        name="firstNameInput"
                        // className={textFieldsBorderStyle.root}
                        label="first name"
                        style={{ width: "100%" }}
                        value={instructorName.firstNameInput}
                        onChange={handleInstructorInputChange}
                        onFocus={() => setFirstNameFocus(true)}
                        onBlur={() => setFirstNameFocus(false)}
                        error={!validFirstName && firstNameFocus}
                        autoComplete="off"
                      />
                    ) : (
                      row.firstName
                    )}
                  </TableCell>
                  <TableCell>
                    {!row.expertise.length || editInstructorID === row.id ? (
                      <FormControl sx={{ width: 300 }}>
                        <InputLabel
                          id="demo-multiple-chip-label"
                          error={!validDisciplineAreas && disciplineAreasFocus}
                        >
                          Discipline areas
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          label="Discipline areas"
                          id="demo-multiple-chip"
                          name="disciplineAreasInput"
                          width="200"
                          multiple
                          value={disciplineAreas}
                          onChange={handleSelectChange}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Discipline areas"
                            />
                          }
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                            </Box>
                          )}
                          MenuProps={MenuProps}
                          onFocus={() => setDisciplineAreasFocus(true)}
                          onBlur={() => setDisciplineAreasFocus(false)}
                          error={!validDisciplineAreas && disciplineAreasFocus}
                        >
                          {recognizedDisciplineAreas.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              style={getStyles(name, disciplineAreas, theme)}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <div className="list-items-discipline-areas">
                        {row.expertise.map((disciplineArea) => (
                          <Chip label={disciplineArea} />
                        ))}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {row.lastName === "" || editInstructorID === row.id ? (
                      <IconButton
                        disabled={
                          !validLastName ||
                          !validFirstName ||
                          !validDisciplineAreas
                        }
                        className="save-btn"
                        onClick={(e) => {
                          saveInstructor(e);
                        }}
                      >
                        <SaveIcon className="save-btn-icon" />
                      </IconButton>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            className="edit-btn"
                            // onClick={(e) => {
                            //   editInstructor(e, row.id);
                            // }}
                            onClick={() => {
                              setEditInstructorID(row.id);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            className="delete-btn"
                            onClick={(e) => {
                              deleteInstructor(e, row.lastName, row.firstName);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <Tooltip title="Add new instructor">
                <Button
                  className="add-instructor-btn"
                  variant="contained"
                  onClick={(event) => addInstructor(event)}
                  disabled={
                    editMode ||
                    tableData.some((instructor) => instructor.lastName === "")
                      ? true
                      : false
                  }
                >
                  <AddIcon />
                </Button>
              </Tooltip>
              <TablePagination
                rowsPerPageOptions={[3, 5]}
                colSpan={3}
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "Rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </ThemeProvider>
    </TableContainer>
  );
}

// TABLE PAGINATION (From Mui tables - custom pagination)
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
const theme = createTheme({
  typography: {
    fontFamily: ["Open sans"],
  },
});
