import React, { useEffect, useState } from "react";
import { getAllPsikologet } from "../../services/PsikologiService";
import DashboardStats from "./DashboardStats";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [psychologistsCount, setPsychologistsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllPsikologet();
      setPsychologistsCount(res.data.length);
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
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Dashboard</h2>
          <DashboardStats psychologistsCount={psychologistsCount} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
