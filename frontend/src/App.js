import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/register";
import Login from "./pages/login";
import Profile from "./pages/profile";
import EquipmentDetails from "./pages/equipmentDetails";
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;