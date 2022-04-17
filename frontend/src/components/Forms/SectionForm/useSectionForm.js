import React, { useState } from "react";
import { makeStyles } from "@mui/styles";

// validateOnChange --> real-time validation on form.
export function useSectionForm(initialValues, validateOnChange = false, validate) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  console.log(formData)

  function handleInputChange(event) {
    const { name, value, label } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (validateOnChange) {
      validate({[name] : value})
    }
  }

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    resetForm,
    handleInputChange,
  };
}

export function Form(props) {
  const useStyles = makeStyles({
    root: {
      "& .MuiFormControl-root": {
        width: "100%",
      },
    },
  });

  const classes = useStyles();
  const { children, ...others } = props;
  return (
    <form className={classes.root} autoComplete="off" {...others}>
      {children}
    </form>
  );
}
