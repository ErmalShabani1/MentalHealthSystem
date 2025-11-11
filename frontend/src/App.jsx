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
import PsikologDashboard from "./pages/Psikolog/PsikologDashboard";
import AddTakimin from "./pages/Psikolog/AddTakimin";
import EditTakimin from "./pages/Psikolog/EditTakimin";
import MenaxhoTakimet from "./pages/Psikolog/MenaxhoTakimet";
import Raportet from "./pages/Psikolog/Raportet";
import PacientDashboard from "./pages/Pacient/PacientDashboard";
import AddPacientinForm from "./pages/Pacient/AddPacientinForm";
import EditPacientinForm from "./pages/Pacient/EditPacientin";
import MenaxhoPacientet from "./pages/Pacient/MenaxhoPacientet";
import MenaxhoTakimetAdmin from "./pages/Admin/MenaxhoTakimetAdmin";
import EditTakiminAdmin from "./pages/Admin/EditTakiminAdmin";
import PacientetEMi from "./pages/Psikolog/PacientetEMi";


function App() {
  return (
    <Router>
      <ToastContainer position="top-center"  autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/add-psikologin" element={<AddPsikologinForm />} />
          < Route path="/edit-psikologin/:id" element={<EditPsikologinForm/>}/>
          <Route path="/menaxhoPsikologet" element={<MenaxhoPsikologet/>}/>
           <Route path="/psikologDashboard" element={<PsikologDashboard />} />
          <Route path="/add-takimet" element={<AddTakimin />} />
          < Route path="/edit-takimet/:id" element={<EditTakimin/>}/>
          <Route path="/menaxhoTakimet" element={<MenaxhoTakimet/>}/>
          <Route path="/raportet" element={<Raportet/>}/>
             <Route path="/pacientDashboard" element={<PacientDashboard />} />
          <Route path="/add-pacientin" element={<AddPacientinForm />} />
          < Route path="/edit-pacientin/:id" element={<EditPacientinForm/>}/>
          <Route path="/menaxhoPacientet" element={<MenaxhoPacientet/>}/>
          <Route path="/menaxhoTakimetAdmin" element={<MenaxhoTakimetAdmin/>}/>
          <Route path="/edit-takimin-admin/:id" element={<EditTakiminAdmin/>}/>
          <Route path="/pacientetEMi" element={<PacientetEMi/>}/>
      </Routes>
    </Router>
  );
}

export default App;
