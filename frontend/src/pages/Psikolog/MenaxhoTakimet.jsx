import React, { useEffect, useState } from "react";
import { getTakimetByPsikologId, deleteTakimin } from "../../services/AppointmentService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function MenaxhoTakimet() {
  const [takimet, setTakimet] = useState([]);
  const psikologId = localStorage.getItem("psikologId");
  const [patients, setPatients] = useState([]); 

  // Merr takimet nga backend
  const fetchData = async () => {
    try {
      const res = await getTakimetByPsikologId(psikologId);
      console.log("🧠 API response:", res.data);
      setTakimet(res.data); // res.data duhet të jetë array e DTO-ve me PatientName si string
    } catch (error) {
      console.error("Gabim gjatë marrjes së takimeve:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë takim?")) {
      try {
        await deleteTakimin(id);
        toast.success("Takimi u fshi me sukses!");
        fetchData();
      } catch (error) {
        toast.error("Gabim gjatë fshirjes së takimit!");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Merr të gjithë pacientët nga backend
    const fetchPatients = async () => {
      try {
        const res = await axios.get(
          "https://localhost:7062/api/Patient/get-all",
          { withCredentials: true }
        );
        setPatients(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së pacientëve:", error);
      }
    };

    fetchPatients();
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
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Menaxho Takimet</h2>

          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Pacienti</th>
                <th>Data e Takimit</th>
                <th>Status</th>
                <th>Shënime</th>
                <th>Veprimet</th>
              </tr>
            </thead>
            <tbody>
  {takimet.map((t) => (
    <tr key={t.id}>
      {/* Shfaqim ID dhe emrin e pacientit */}
      <td>{t.patientId} - {t.patientName}</td>
      <td>{new Date(t.appointmentDate).toLocaleString()}</td>
      <td>{t.status}</td>
      <td>{t.notes}</td>
      <td>
        <Link
          to={`/edit-takimin/${t.id}`}
          className="btn btn-warning btn-sm me-2"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(t.id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MenaxhoTakimet;
