import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/register";
import Login from "./pages/login";
import Profile from "./pages/profile";
import EquipmentDetails from "./pages/equipmentDetails";
import Home from "./pages/home";
import DisplayReviews from "./pages/DisplayReviews";
import UserEquipment from "./pages/userEquipment";
import UpdateEquipment from "./buttons/UpdateEquipment";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/equipment/:equipmentId/reviews" element={<DisplayReviews />} />
        <Route path="/my-equipment" element={<UserEquipment />} />
        <Route path="/equipment-form" element={<UpdateEquipment />} />
        <Route path="/equipment-form/:id" element={<UpdateEquipment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;