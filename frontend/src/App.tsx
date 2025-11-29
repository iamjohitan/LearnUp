import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FacultadesPage from "./pages/facultades";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GroupsChat from "./pages/groups";
import ChangeFaculty from "./pages/ChangeFaculty";
import CoursesByFaculty from "./pages/CoursesByFaculty";
import GroupDetail from "./pages/GroupDetail";
import AdminPanel from "./pages/AdminPanel";
import VerifyEmail from "./pages/verifyEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/facultades" element={<FacultadesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/cursos" element={<CoursesByFaculty />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/facultad" element={<ChangeFaculty />} />
        <Route path="/groups" element={<GroupsChat groupId="default" />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
