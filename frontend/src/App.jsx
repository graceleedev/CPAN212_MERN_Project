import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import VerifyLogin from "./pages/VerifyLogin.jsx";
import Register from "./pages/Register.jsx";
import Lessons from "./pages/Lessons.jsx";
import UserSettings from "./pages/UserSettings.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-verify" element={<VerifyLogin />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
