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
import MenaxhoUserat from "./pages/Admin/MenaxhoUserat";
import EditUser from "./pages/Admin/EditUser";
import AddUser from "./pages/Admin/AddUser";
import PsikologDashboard from "./pages/Psikolog/PsikologDashboard";
import AddTakimin from "./pages/Psikolog/AddTakimin";
import EditTakimin from "./pages/Psikolog/EditTakimin";
import MenaxhoTakimet from "./pages/Psikolog/MenaxhoTakimet";
import PacientDashboard from "./pages/Pacient/PacientDashboard";
import AddPacientinForm from "./pages/Pacient/AddPacientinForm";
import EditPacientinForm from "./pages/Pacient/EditPacientin";
import MenaxhoPacientet from "./pages/Pacient/MenaxhoPacientet";
import MenaxhoTakimetAdmin from "./pages/Admin/MenaxhoTakimetAdmin";
import EditTakiminAdmin from "./pages/Admin/EditTakiminAdmin";
import PacientetEMi from "./pages/Psikolog/PacientetEMi";
import AddRaportinForm from "./pages/Psikolog/AddRaportinForm";
import EditRaportinForm from "./pages/Psikolog/EditRaportinForm";
import MenaxhoRaportet from "./pages/Psikolog/MenaxhoRaportetForm";
import ShfaqRaportet from "./pages/Pacient/ShfaqRaportet";
import ShfaqTakimet from "./pages/Pacient/ShfaqTakimet";
import ShfaqPsikologet from "./pages/Pacient/ShfaqPsikologet";
import MenaxhoTerapine from "./pages/Psikolog/MenaxhoTerapine";
import AddTerapine from "./pages/Psikolog/AddTerapine";
import ShfaqTerapine from "./pages/Pacient/ShfaqTerapine";
import AddTreatmentPlan from "./pages/Psikolog/AddTreatmentPlan";
import EditTreatmentPlan from "./pages/Psikolog/EditTreatmentPlan";
import MenaxhoTreatmentPlan from "./pages/Psikolog/MenaxhoTreatmentPlan";
import ShfaqTreatmentPlan from "./pages/Pacient/ShfaqTreatmentPlan";
import EditTherapySession from "./pages/Psikolog/EditTherapySession";
import AddUshtrimin from "./pages/Psikolog/AddUshtrimin";
import EditUshtrimin from "./pages/Psikolog/EditUshtrimin";
import MenaxhoUshtrimet from "./pages/Psikolog/MenaxhoUshtrimet";
import ShfaqUshtrimet from "./pages/Pacient/ShfaqUshtrimet";
import AddNewsForm from "./pages/Psikolog/AddNewsForm";
import EditNewsForm from "./pages/Psikolog/EditNewsForm";
import MenaxhoNews from "./pages/Psikolog/MenaxhoNews";
import NewsList from "./pages/Pacient/NewsList";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import MenaxhoNotifications from "./pages/Psikolog/MenaxhoNotifications";
import AddNotification from "./pages/Psikolog/AddNotification";
import EditNotification from "./pages/Psikolog/EditNotification";
import MyNotifications from "./pages/Pacient/MyNotifications";


function App() {
  return (
    <Router>
      <ToastContainer position="top-center"  autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/adminDashboard" element={<AdminDashboard />} />
           {/* Psikolog&User Routes */}
          <Route path="/add-psikologin" element={<AddPsikologinForm />} />
          < Route path="/edit-psikologin/:id" element={<EditPsikologinForm/>}/>
          <Route path="/menaxhoPsikologet" element={<MenaxhoPsikologet/>}/>
          <Route path="/menaxhoUserat" element={<MenaxhoUserat/>}/>
          <Route path="/edit-user/:id" element={<EditUser/>}/>
          <Route path="/add-user" element={<AddUser/>}/>
            {/* Takimet Routes */}
           <Route path="/psikologDashboard" element={<PsikologDashboard />} />
          <Route path="/add-takimet" element={<AddTakimin />} />
          < Route path="/edit-takimet/:id" element={<EditTakimin/>}/>
          <Route path="/menaxhoTakimet" element={<MenaxhoTakimet/>}/>
           <Route path="/menaxhoTakimetAdmin" element={<MenaxhoTakimetAdmin/>}/>
          <Route path="/edit-takimin-admin/:id" element={<EditTakiminAdmin/>}/>
            {/* Pacienti Routes */}
             <Route path="/pacientDashboard" element={<PacientDashboard />} />
          <Route path="/add-pacientin" element={<AddPacientinForm />} />
          < Route path="/edit-pacientin/:id" element={<EditPacientinForm/>}/>
          <Route path="/menaxhoPacientet" element={<MenaxhoPacientet/>}/>
          <Route path="/pacientetEMi" element={<PacientetEMi/>}/>
           {/* HealthReports Routes */}
             <Route path="/add-raportin" element={<AddRaportinForm />} />
          < Route path="/edit-raportin/:id" element={<EditRaportinForm/>}/>
          <Route path="/menaxhoRaportet" element={<MenaxhoRaportet/>}/>
           {/* Per shfaqjen e komponenteve ne pacientDashboard Routes */}
          <Route path="/shfaqRaportet" element={<ShfaqRaportet/>}/>
          <Route path="/shfaqTakimet" element={<ShfaqTakimet/>}/>
          <Route path="/shfaqPsikologet" element={<ShfaqPsikologet/>}/>
           {/* TherapySessions Routes */}
          <Route path="/menaxhoTerapine" element={<MenaxhoTerapine/>}/>
          <Route path="/add-terapine" element={<AddTerapine/>}/>
          <Route path="/edit-terapine/:id" element={<EditTherapySession />} />
          <Route path="/shfaqTerapine" element={<ShfaqTerapine/>}/>
          {/* Treatment Plan Routes */}
          <Route path="/add-treatmentplan" element={<AddTreatmentPlan />} />
          <Route path="/edit-treatmentplan/:id" element={<EditTreatmentPlan />} />
          <Route path="/menaxho-treatmentplan" element={<MenaxhoTreatmentPlan />}   />
          <Route path="/shfaq-treatmentplan" element={<ShfaqTreatmentPlan />} />
          {/* Ushtrimet Routes */}
          <Route path="/add-ushtrim" element={<AddUshtrimin />} />
          <Route path="/edit-ushtrim/:id" element={<EditUshtrimin />} />
          <Route path="/menaxho-ushtrimet" element={<MenaxhoUshtrimet />} />
          <Route path="/shfaq-ushtrimet" element={<ShfaqUshtrimet />} />
          {/* News*/}
          <Route path="/add-news" element={<AddNewsForm />} />
          <Route path="/edit-news/:id" element={<EditNewsForm />} />
          <Route path="/menaxhoNews" element={<MenaxhoNews />} />
          <Route path="/newsList" element={<NewsList />} /> // HomeScreen
          {/* Notifications */}
          <Route path="/admin-notifications" element={<AdminNotifications />} />
          <Route path="/menaxho-notifications" element={<MenaxhoNotifications />} />
          <Route path="/add-notification" element={<AddNotification />} />
          <Route path="/edit-notification/:id" element={<EditNotification />} />
          <Route path="/my-notifications" element={<MyNotifications />} />
      </Routes>
    </Router>
  );
}

export default App;