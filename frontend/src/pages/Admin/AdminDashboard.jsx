import React, { useEffect, useState } from "react";
import { getAllPsikologet } from "../../services/PsikologiService";
import { getAllPatients } from "../../services/PacientiService";
import { getAllAppointmentsAdmin } from "../../services/AppointmentService";
import { Link } from "react-router-dom";
import DashboardStats from "../Admin/DashboardStats";

function AdminDashboard() {
  const [psychologistsCount, setPsychologistsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [takimetCount, setTakimetCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPsych = await getAllPsikologet();
        setPsychologistsCount(resPsych.data.length);

        const resPatients = await getAllPatients();
        setPatientsCount(resPatients.data.length);
        const resTakimet = await getAllAppointmentsAdmin();
        setTakimetCount(resTakimet.data.length);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh" }}
      >
        <h4 className="mb-4 text-center">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/adminDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <h6 className="text-center">👨‍⚕️Psikologet</h6>
          <li className="nav-item mb-2">
            <Link to="/add-psikologin" className="nav-link text-white">
              ➕ Shto Psikolog
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoPsikologet" className="nav-link text-white">
              👨‍⚕️ Menaxho Psikologët
            </Link>
          </li>
           <h6 className="text-center">👨‍⚕️ Pacientet</h6>
          <li className="nav-item mb-2">
            <Link to="/add-pacientin" className="nav-link text-white">
              ➕ Shto Pacient
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoPacientet" className="nav-link text-white">
              👨‍⚕️ Menaxho Pacientët
            </Link>
          </li>

      
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
     <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Dashboard</h2>
          <DashboardStats takimetCount={takimetCount} patientsCount={patientsCount} psychologistsCount={psychologistsCount}/>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
