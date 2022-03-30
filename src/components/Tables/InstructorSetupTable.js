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
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    // "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    //   borderColor: "grey"
    // },
    // "& .MuiOutlinedInput-input": {
    //   color: "grey"
    // },
    // "& .MuiInputLabel-outlined": {
    //   color: "grey",
    // },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },

    "&:hover .MuiOutlinedInput-input": {
      color: "black",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "black",
    },

    "&:hover .MuiInputLabel-outlined": {
      color: "black",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "black",
    },
  },
});

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

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [tableData, setTableData] = React.useState([]);
  const [instructorName, setInstructorName] = React.useState({
    lastNameInput: "",
    firstNameInput: "",
  });
  const [disciplineAreas, setDisciplineAreas] = React.useState([]);

  console.log(tableData);

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

  function saveCurrentTable() {
    console.log(tableData.lastName);
    axios
      .post(
        "/add-instructor",
        {
          tableData: tableData,
        },
        { headers: { "Content-Type": "application/json" } }
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
  function saveInstructor(event) {
    // for some reason, setTableData does not force a re-render
    const indexOfNewInstructor = tableData.findIndex(
      (instructor) =>
        instructor.lastName === "" &&
        instructor.firstName === "" &&
        !instructor.expertise.length
    );

    setTableData((prevTableData) => {
      let newTableData = prevTableData;

      newTableData[indexOfNewInstructor] = {
        lastName: instructorName.lastNameInput,
        firstName: instructorName.firstNameInput,
        expertise: disciplineAreas,
      };
      console.log(newTableData);
      return newTableData;
    });

    // console.log(tableData);
    saveCurrentTable();

    // clear data.
    setInstructorName({
      lastNameInput: "",
      firstNameInput: "",
    });
    setDisciplineAreas([]);
  }

  function handleInstructorInputChange(e) {
    const { name, value } = e.target;
    setInstructorName((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
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

  const [isFormInvalid, setIsFormInvalid] = React.useState(false);
  const textFieldsBorderStyle = useStyles();
  const theme = useTheme();

  return (
    <TableContainer component={Paper} style={{ width: "65vw" }}>
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
              console.log(row);
              return (
                <TableRow key={row.name}>
                  <TableCell className="last-name-text">
                    {row.lastName === "" ? (
                      <TextField
                        variant="outlined"
                        name="lastNameInput"
                        className={textFieldsBorderStyle.root}
                        label="last name"
                        style={{ width: "100%" }}
                        value={instructorName.lastNameInput}
                        onChange={handleInstructorInputChange}
                        autoFocus
                        // InputProps={{ style: { fontSize: "small" } }}
                        // InputLabelProps={{ style: { fontSize: "small" } }}
                      />
                    ) : (
                      row.lastName
                    )}
                  </TableCell>
                  <TableCell>
                    {row.firstName === "" ? (
                      <TextField
                        variant="outlined"
                        name="firstNameInput"
                        className={textFieldsBorderStyle.root}
                        label="first name"
                        style={{ width: "100%" }}
                        value={instructorName.firstNameInput}
                        onChange={handleInstructorInputChange}
                        // InputProps={{ style: { fontSize: "small" } }}
                        // InputLabelProps={{ style: { fontSize: "small" } }}
                      />
                    ) : (
                      row.firstName
                    )}
                  </TableCell>
                  <TableCell>
                    {!row.expertise.length ? (
                      <FormControl sx={{ width: 300 }}>
                        <InputLabel id="demo-multiple-chip-label">
                          Discipline areas
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          label="Discipline areas"
                          id="demo-multiple-chip"
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
                    {row.lastName === "" ? (
                      <IconButton
                        className="save-btn"
                        disabled={isFormInvalid}
                        onClick={(e) => saveInstructor(e)}
                      >
                        {" "}
                        <SaveIcon className="save-btn-icon" />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton className="edit-btn">
                          <EditIcon />
                        </IconButton>
                        <IconButton className="delete-btn">
                          <DeleteIcon />
                        </IconButton>
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
              <Button
                className="add-instructor-btn"
                variant="contained"
                onClick={(event) => addInstructor(event)}
                disabled={
                  tableData.some((instructor) => instructor.lastName === "")
                    ? true
                    : false
                }
              >
                <AddIcon />
              </Button>
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

{
  /* SAMPLE DATA */
}
{
  /* <TableCell style={{ fontWeight: "bold" }}>Carreon</TableCell>
            <TableCell>Mitchel</TableCell>
            <TableCell>discipline areas</TableCell>
            <TableCell>0</TableCell>
            <TableCell style={{ width: "5rem" }}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </TableCell> */
}

{
  /* <table className="roster-table">
<thead>
  <tr className="table-title">
    <th colSpan={3} style={{ fontWeight: "normal" }}>
      Current Roster
    </th>
    <th style={{ textAlign: "end", paddingRight: "0.75rem" }}>
      Instructors
    </th>
  </tr>
  <tr className="table-headers">
    <th>Last Name</th>
    <th>First Name</th>
    <th>Expertise</th>
    <th>Maximum Load</th>
  </tr>
</thead>

<tbody>
  <tr className="table-data">
    <td>Doe</td>
    <td>John</td>
    <td>
      <ul>
        <li> Software Development</li>
        <li> Cryptography</li>
      </ul>
    </td>
    <td>60%</td>
  </tr>
</tbody>

<tfoot>
  <tr>
    <td colSpan={4}>
      <button className="add-instructor-btn">
        <img src={plusIcon} alt="plus" />
      </button>
    </td>
  </tr>
</tfoot>
</table> */
}

// const rows = [
//   createData("Cupcake", 305, 3.7),
//   createData("Donut", 452, 25.0),
//   createData("Eclair", 262, 16.0),
//   createData("Frozen yoghurt", 159, 6.0),
//   createData("Gingerbread", 356, 16.0),
//   createData("Honeycomb", 408, 3.2),
//   createData("Ice cream sandwich", 237, 9.0),
//   createData("Jelly Bean", 375, 0.0),
//   createData("KitKat", 518, 26.0),
//   createData("Lollipop", 392, 0.2),
//   createData("Marshmallow", 318, 0),
//   createData("Nougat", 360, 19.0),
//   createData("Oreo", 437, 18.0),
// ].sort((a, b) => (a.calories < b.calories ? -1 : 1));
