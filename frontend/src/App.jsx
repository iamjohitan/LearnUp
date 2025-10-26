// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import Pending from "./pages/Pending";
import Verified from "./pages/Verified";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/verified" element={<Verified />} />
      </Routes>
    </Router>
  );
}

export default App;
