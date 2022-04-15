import { Button } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    minWidth: "0 !important",
  },
  //   secondary: {
  //     backgroundColor: theme.palette.secondary.light,
  //     "& .MuiButton-label": {
  //       color: theme.palette.secondary.main,
  //     },
  //   },
  primary: {
    backgroundColor: "#732d40 !important",
    color: "#FFF !important",
  },
});

export default function ActionButton(props) {
  const { variant, color, children, handleClick } = props;

  const classes = useStyles();
  return (
    <Button
      variant={variant}
      className={`${classes.root} ${classes[color]}`}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
