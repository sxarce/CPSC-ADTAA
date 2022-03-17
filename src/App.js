import "./App.css";
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
} from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  useRoutes,
} from "react-router-dom";
import RegisterPage from "./pages/RegistrationPage/RegisterPage";
import SetupPage from "./pages/SetupPage/SetupPage";

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <RegisterPage /> },

    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/setup", element: <SetupPage /> },
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
