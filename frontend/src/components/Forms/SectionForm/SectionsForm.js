import { Grid } from "@mui/material";
import React from "react";
import Controls from "./controls/Controls";

import { useSectionForm, Form } from "./useSectionForm";
import { Box } from "@mui/system";

import axios from "axios";

//  width: 50vw; height: 60vh;top: 12%;left: 20%;

const radioGroupItems = [
  { id: "2", title: "2" }, // id is value, title is label of radio button
  { id: "3", title: "3" },
];

const validClassDays = [
  { name: "Monday", key: "M" }, // value is name.
  { name: "Tuesday", key: "T" },
  { name: "Wednesday", key: "W" },
  { name: "Thursday", key: "Th" },
  { name: "Friday", key: "F" },
];

const initialValues = {
  id: -1,
  courseNumber: "",
  sectionNumber: "",
  numMeetingPeriods: "2",

  meetingPeriod1Day: "",
  meetingPeriod1Start: new Date(),
  meetingPeriod1End: new Date(),

  meetingPeriod2Day: "",
  meetingPeriod2Start: new Date(),
  meetingPeriod2End: new Date(),

  meetingPeriod3Day: "",
  meetingPeriod3Start: new Date(),
  meetingPeriod3End: new Date(),
};
export default function SectionsForm(props) {
  function getAvailableCourses() {
    axios
      .get("/get-course-list", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        let retrievedTableData = response.data.TableData;

        if (retrievedTableData) {
          setCourseList(retrievedTableData);
        }
      })
      .catch((error) => console.log(error));
  }
  React.useEffect(() => getAvailableCourses(), []);
  const [courseList, setCourseList] = React.useState([]);

  const validate = (formDataFields = formData) => {
    let temp = { ...errors };

    if ("sectionNumber" in formDataFields) {
      temp.sectionNumber = formDataFields.sectionNumber ? "" : "*Required";
    }
    if ("courseNumber" in formDataFields) {
      temp.courseNumber = formDataFields.courseNumber ? "" : "*Required";
    }

    setErrors({ ...temp });

    if (formDataFields === formData) {
      return Object.values(temp).every((elem) => elem === ""); // for validate() call. Submitting the form
    }
  };

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    resetForm,
    handleInputChange,
  } = useSectionForm(initialValues, true, validate);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      window.alert("Submitted!");
      

      // add jwt_required() in route. then add corresponding header { Authentication } to post()
      axios
        .post("/add-section", formData)
        .then((response) => {
          console.log(response)

          // update records/tableData
          props.setRecords(response.data.TableData)
        })
        .catch((error) => console.log(error));

      resetForm();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={5}>
          <Controls.Select
            variant="filled"
            name="courseNumber"
            label="Course #"
            value={formData.courseNumber}
            handleChange={handleInputChange}
            options={courseList}
            error={errors.courseNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <Controls.Input
            variant="filled"
            label="Section #"
            name="sectionNumber"
            value={formData.sectionNumber}
            handleChange={handleInputChange}
            type="number"
            error={errors.sectionNumber}
          />
        </Grid>

        <Grid item xs={3}>
          <Controls.RadioGroup
            name="numMeetingPeriods"
            label="# of meeting days:"
            value={formData.numMeetingPeriods}
            handleChange={handleInputChange}
            items={radioGroupItems}
          />
        </Grid>
        {formData.numMeetingPeriods && (
          <>
            <Grid item xs={5}>
              <Controls.Select
                name="meetingPeriod1Day"
                variant="standard"
                label="Period 1 Day"
                value={formData.meetingPeriod1Day}
                handleChange={handleInputChange}
                options2={validClassDays}
              />
            </Grid>

            <Grid item xs={3.5}>
              <Controls.TimePicker
                name="meetingPeriod1Start"
                label="Period 1 Start time"
                value={formData.meetingPeriod1Start}
                handleChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3.5}>
              <Controls.TimePicker
                name="meetingPeriod1End"
                label="Period 1 End time"
                value={formData.meetingPeriod1End}
                handleChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={5}>
              <Controls.Select
                name="meetingPeriod2Day"
                variant="standard"
                label="Period 2 Day"
                value={formData.meetingPeriod2Day}
                handleChange={handleInputChange}
                options2={validClassDays}
              />
            </Grid>
            <Grid item xs={3.5}>
              <Controls.TimePicker
                name="meetingPeriod2Start"
                label="Period 2 Start time"
                value={formData.meetingPeriod2Start}
                handleChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={3.5}>
              <Controls.TimePicker
                name="meetingPeriod2End"
                label="Period 2 End time"
                value={formData.meetingPeriod2End}
                handleChange={handleInputChange}
              />
            </Grid>
            {formData.numMeetingPeriods === "3" && (
              <>
                <Grid item xs={5}>
                  <Controls.Select
                    name="meetingPeriod3Day"
                    variant="standard"
                    label="Period 3 Day"
                    value={formData.meetingPeriod3Day}
                    handleChange={handleInputChange}
                    options2={validClassDays}
                  />
                </Grid>
                <Grid item xs={3.5} align="center">
                  <Controls.TimePicker
                    name="meetingPeriod3Start"
                    label="Period 3 Start time"
                    value={formData.meetingPeriod3Start}
                    handleChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={3.5} align="center">
                  <Controls.TimePicker
                    name="meetingPeriod3End"
                    label="Period 3 End time"
                    value={formData.meetingPeriod3End}
                    handleChange={handleInputChange}
                  />
                </Grid>
              </>
            )}
          </>
        )}

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Controls.Button
              text="Submit"
              type="submit"
              color="primary"
              variant="contained"
            />
            <Controls.Button
              text="Reset"
              variant="text"
              disableRipple
              color="primary"
              sx={{ marginLeft: "10px" }}
              handleClick={resetForm}
            />
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
}
