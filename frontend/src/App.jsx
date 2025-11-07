import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddPsikologinForm from "./pages/Admin/AddPsikologinForm";
import EditPsikologinForm from "./pages/Admin/EditPsikologinForm";
import MenaxhoPsikologet from "./pages/Admin/MenaxhoPsikologet";


function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/add-psikologin" element={<AddPsikologinForm />} />
          < Route path="/edit-psikologin/:id" element={<EditPsikologinForm/>}/>
          <Route path="/menaxhoPsikologet" element={<MenaxhoPsikologet/>}/>
       
      </Routes>
    </Router>
  );
}

export default App;
