import React from "react";
import NavBar from "./Components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AdminPage from "./Pages/AdminPage";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import "./main.css";
import Context from "./Pages/Context";
import Register from "./Pages/Register";

function App() {
  return (
    <BrowserRouter>
    <Context> 
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/admin" element={<AdminPage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
      </Context>
    </BrowserRouter>
  );
}

export default App;
