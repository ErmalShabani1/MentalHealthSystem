import React, { useEffect, useState } from "react";
import DashboardStats from "./DashboardStats";
import { Link } from "react-router-dom";
import { getTakimetByPsikologId } from "../../services/AppointmentService";
import { getAllPatients } from "../../services/PacientiService";

function PsikologDashboard() {
  const [takimetCount, setTakimetCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const psikologId = localStorage.getItem("psikologId"); // ruaje në login
useEffect(() => {
  const fetchData = async () => {
    const psikologId = localStorage.getItem("psikologId");

    if (!psikologId) return;

    try {
      const res = await getTakimetByPsikologId(psikologId);
      setTakimetCount(res.data.length);
      const resPatients = await getAllPatients();
      setPatientsCount(resPatients.data.length); // <-- ketu marrim vetem numrin
    } catch (error) {
      console.error("Gabim gjatë marrjes së takimeve:", error);
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
        <h4 className="mb-4 text-center">Psikolog Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/psikologDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/add-takimet" className="nav-link text-white">
              ➕ Shto Takim
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoTakimet" className="nav-link text-white">
              📋 Menaxho Takimet
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/raportet" className="nav-link text-white">
              📊 Raportet e Pacientëve
            </Link>
          </li>
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Dashboard</h2>
          <DashboardStats takimetCount={takimetCount} patientsCount={patientsCount} />
        </div>
      </div>
    </div>
  );
}

export default PsikologDashboard;
