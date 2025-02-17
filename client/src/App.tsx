import {  BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import List from './pages/list/List';
import Car from './pages/car/Car';
import Login from './pages/login/Login';
import Register from "./pages/register/Register";
import AdminPage from "./pages/admin/AdminPage";
import AdminRoute from "./components/AdminRoute";
import Booking from "./pages/bookings/Booking";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/cars" element = {<List/>}/>
        <Route path = "/cars/:id" element = {<Car/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/register" element = {<Register/>}/>
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path = "/bookings" element = {<Booking/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
