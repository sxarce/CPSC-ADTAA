import "./App.css";
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
} from "react";
import LoginPage from './pages/LoginPage/LoginPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import { BrowserRouter as Router, Routes, Switch, Route, useRoutes } from "react-router-dom";

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <LoginPage /> },
    { path: "/login", element: <LoginPage /> },
  ]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
