import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FacultadesPage from './pages/facultades'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GroupsChat from './pages/groups'
import ChangeFaculty from './pages/ChangeFaculty'
import CoursesByFaculty from './pages/CoursesByFaculty';
import GroupDetail from './pages/GroupDetail';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<Navigate to="/" replace />} />
        <Route path="/facultades" element={<FacultadesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/app/admin" element={<AdminPanel />} />
        <Route path="/courses" element={<CoursesByFaculty />} />
        <Route path="/app/courses" element={<CoursesByFaculty />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        <Route path="/changeFaculty" element={<ChangeFaculty />} />
        <Route path="/app/changeFaculty" element={<ChangeFaculty />} />
        <Route path="/groups" element={<GroupsChat groupId="default" />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="/app/groups" element={<GroupsChat groupId="default" />} />
        <Route path="/app/groups/:groupId" element={<GroupDetail />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
