import React, { useEffect, useState } from "react";
import { getAllAppointmentsAdmin } from "../../services/AppointmentService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function MenaxhoTakimetAdmin() {
  const navigate = useNavigate();
  const [takimet, setTakimet] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/adminDashboard");
  };

  useEffect(() => {
    fetchTakimet();
  }, []);

  const fetchTakimet = async () => {
    try {
      const res = await getAllAppointmentsAdmin();
      setTakimet(res.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së takimeve:", error);
      toast.error("Gabim gjatë marrjes së takimeve");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Duke ngarkuar...</div>;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "240px", position: "fixed", height: "100vh" }}
      >
        <h4 className="mb-4 text-center">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/adminDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoTakimetAdmin" className="nav-link text-white">
              📋 Menaxho Takimet
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={handleBack} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      <div className="flex-grow-1" style={{ marginLeft: "240px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Menaxho Takimet - Admin</h2>

          {takimet.length === 0 ? (
            <div className="alert alert-info">Nuk ka takime për të shfaqur</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Pacienti</th>
                    <th>Psikologu</th>
                    <th>Data dhe Koha</th>
                    <th>Statusi</th>
                    <th>Shënime</th>
                  </tr>
                </thead>
                <tbody>
                  {takimet.map((takimi, index) => (
                <tr key={takimi.id}>
                  <td>{index + 1}</td>
                  <td>
                    {takimi.patient?.emri && takimi.patient?.mbiemri 
                      ? `${takimi.patient.emri} ${takimi.patient.mbiemri}`
                      : takimi.patientName || "N/A"
                    }
                  </td>
                  <td>
                    {takimi.psikolog?.name && takimi.psikolog?.surname 
                      ? `${takimi.psikolog.name} ${takimi.psikolog.surname}`
                      : "N/A"
                    }
                  </td>
                  <td>
                    {new Date(takimi.appointmentDate).toLocaleDateString('sq-AL')}
                    <br />
                    <small className="text-muted">
                      {new Date(takimi.appointmentDate).toLocaleTimeString('sq-AL')}
                    </small>
                  </td>
                  <td>
                    <span className={`badge ${
                      takimi.status === 'Completed' ? 'bg-success' : 
                      takimi.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                    }`}>
                      {takimi.status}
                    </span>
                  </td>
                  <td>
                    {takimi.notes ? (
                      <span title={takimi.notes}>
                        {takimi.notes.length > 30 
                          ? `${takimi.notes.substring(0, 30)}...` 
                          : takimi.notes
                        }
                      </span>
                    ) : (
                      <span className="text-muted">Nuk ka shënime</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default MenaxhoTakimetAdmin;