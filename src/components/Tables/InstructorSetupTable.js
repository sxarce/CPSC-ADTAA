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

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    border: "1px solid #ced4da",
    fontSize: "small",
    width: "10vw",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: ["Open sans"].join(","),
    "&:focus": {
      boxShadow: `${alpha("#000", 0.25)} 0 0 0 0.2rem`,
      borderColor: "#000",
    },
  },
}));

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tableData, setTableData] = React.useState([]);
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

  function addInstructor(event) {
    // console.log(event);
    const rowsInput = {
      lastName: "",
      firstName: "",
      expertise: "",
      maxLoad: "",
    };
    setTableData((prevTableData) => [...prevTableData, rowsInput]);
  }
  function saveInstructor(event) {
    // console.log(event);
    console.log(
      tableData.findIndex((instructor) => instructor.lastName === "")
    );
    let indexToEdit = tableData.findIndex(
      (instructor) => instructor.lastName === ""
    );
    setTableData((prevTableData) => {
      const index = prevTableData.findIndex(
        (instructor) => instructor.lastName === ""
      );
      prevTableData[index] = {
        lastName: formData.lastNameInput,
        firstName: formData.firstNameInput,
        expertise: formData.expertiseInput,
        maxLoad: formData.maxLoadInput,
      };
      return prevTableData;
    });

    setFormData({
      lastNameInput: "",
      firstNameInput: "",
      expertiseInput: "",
      maxLoadInput: "",
    });
  }

  const [formData, setFormData] = React.useState({
    lastNameInput: "",
    firstNameInput: "",
    expertiseInput: "",
    maxLoadInput: "",
  });
  console.log(formData);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...formData,
        [name]: value,
      };
    });
  }

  const [isFormInvalid, setIsFormInvalid] = React.useState(false);

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
              {/* <TableCell style={HeaderStyle}>Maximum load</TableCell> */}
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
            ).map((row) => (
              <TableRow key={row.name}>
                <TableCell className="last-name-text">
                  {row.lastName === "" ? (
                    <TextField
                      variant="outlined"
                      name="lastNameInput"
                      style={{ width: "90%" }}
                      value={formData.lastNameInput}
                      onChange={handleInputChange}
                      autoFocus
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
                      style={{ width: "90%" }}
                      value={formData.firstNameInput}
                      onChange={handleInputChange}
                    />
                  ) : (
                    row.firstName
                  )}
                </TableCell>
                <TableCell>
                  {row.expertise === "" ? (
                    <TextField
                      variant="outlined"
                      name="expertiseInput"
                      style={{ width: "90%" }}
                      value={formData.expertiseInput}
                      onChange={handleInputChange}
                    />
                  ) : (
                    row.expertise
                  )}
                </TableCell>

                <TableCell>
                  {row.lastName === "" ? (
                    <IconButton
                      className="save-btn"
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
            ))}

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
