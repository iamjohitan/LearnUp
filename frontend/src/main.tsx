import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmail from "./pages/verifyEmail";
import ChangeFaculty from "./pages/ChangeFaculty"
import facultades from "./pages/facultades"
import App from "./App";


const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify", element: <VerifyEmail /> },
  { path: "/changeFaculty", element: <ChangeFaculty /> },
  { path: "/facultades", element: <facultades /> },
  { path: "/app", element: <App /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
