import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import React from "react";

export default function Select(props) {
  const {
    variant,
    name,
    label,
    value,
    handleChange,
    options,
    options2,
    options3,
    error = null,
  } = props;

  return (
    <FormControl variant={variant} {...(error && { error: true })}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
      >
        {options &&
          options.map((course) => (
            <MenuItem key={course.id} value={course.number}>
              {`${course.name} (${course.number})`}
            </MenuItem>
          ))}

        {options2 &&
          options2.map((day) => (
            <MenuItem key={day.key} value={day.name}>
              {day.name}
            </MenuItem>
          ))}

        {options3 &&
          options3.map((algo) => (
            <MenuItem key={algo.key} value={algo.name}>
              {algo.name}
            </MenuItem>
          ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
