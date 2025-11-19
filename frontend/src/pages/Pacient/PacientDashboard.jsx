import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyRaportet } from "../../services/RaportService";
import { getMyTakimet } from "../../services/AppointmentService"; // Krijo këtë service
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function PacientDashboard() {
  const navigate = useNavigate();
  const [raportet, setRaportet] = useState([]);
  const [takimet, setTakimet] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Merr të dhënat e pacientit
        const [raportetRes, takimetRes] = await Promise.all([
          getMyRaportet().catch(err => { 
            console.log("Raportet nuk u morën:", err); 
            return { data: [] }; 
          }),
          getMyTakimet().catch(err => { 
            console.log("Takimet nuk u morën:", err); 
            return { data: [] }; 
          })
        ]);

        setRaportet(raportetRes.data || []);
        setTakimet(takimetRes.data || []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
        toast.error("Gabim gjatë ngarkimit të të dhënave");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Llogarit statistikat
  const stats = {
    totalRaporte: raportet.length,
    totalTakime: takimet.length,
    takimeSot: takimet.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.appointmentDate).toDateString() === today;
    }).length,
    takimeAktive: takimet.filter(t => t.status === "Scheduled").length
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh", overflowY: "auto" }}
      >
        <h4 className="mb-4 text-center">Pacient Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/pacientDashboard" className="nav-link text-white active">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaqRaportet" className="nav-link text-white">
              📊 Raportet e Mia
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaqTakimet" className="nav-link text-white">
              📅 Takimet e Mia
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaqPsikologet" className="nav-link text-white">
              👨‍⚕️ Psikologët
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Dashboard i Pacientit</h2>
            <div className="text-muted">
              {new Date().toLocaleDateString('sq-AL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Duke ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar të dhënat...</p>
            </div>
          ) : (
            <>
              {/* Statistikat */}
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Raportet e Mia
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.totalRaporte}
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-primary">
                            <i className="fas fa-file-medical text-white"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Takimet e Mia
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.totalTakime}
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-success">
                            <i className="fas fa-calendar-check text-white"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Takimet Sot
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.takimeSot}
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-info">
                            <i className="fas fa-calendar-day text-white"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Takime Aktive
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.takimeAktive}
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-warning">
                            <i className="fas fa-clock text-white"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Raportet e Fundit */}
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Raportet e Mia të Fundit</h5>
                      <Link to="/shfaqRaportet" className="btn btn-sm btn-outline-primary">
                        Shiko të Gjitha
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      <RaportetList raportet={raportet.slice(0, 5)} />
                    </div>
                  </div>
                </div>

                {/* Takimet e Ardhshme */}
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Takimet e Ardhshme</h5>
                      <Link to="/shfaqTakimet" className="btn btn-sm btn-outline-success">
                        Shiko të Gjitha
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      <TakimetList takimet={takimet.filter(t => 
                        new Date(t.appointmentDate) > new Date() && t.status === "Scheduled"
                      ).slice(0, 5)} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Komponenti për listën e raporteve
function RaportetList({ raportet }) {
  return (
    <div className="list-group list-group-flush">
      {raportet.length > 0 ? (
        raportet.map((rap, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="flex-grow-1">
              <h6 className="mb-1 text-primary">{rap.title}</h6>
              <small className="text-muted">
                {new Date(rap.createdAt).toLocaleDateString('sq-AL')}
              </small>
              {rap.diagnoza && (
                <small className="d-block text-muted">
                  Diagnoza: {rap.diagnoza.length > 30 ? `${rap.diagnoza.substring(0, 30)}...` : rap.diagnoza}
                </small>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4">
          <i className="fas fa-file-medical fa-2x mb-2"></i>
          <p className="mb-0">Nuk keni raporte</p>
        </div>
      )}
    </div>
  );
}

// Komponenti për listën e takimeve
function TakimetList({ takimet }) {
  return (
    <div className="list-group list-group-flush">
      {takimet.length > 0 ? (
        takimet.map((takim, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="flex-grow-1">
              <h6 className="mb-1">{takim.psikologName || "Psikologu"}</h6>
              <small className="text-muted d-block">
                {new Date(takim.appointmentDate).toLocaleDateString('sq-AL')}
              </small>
              <small className="text-muted">
                {new Date(takim.appointmentDate).toLocaleTimeString('sq-AL')}
              </small>
            </div>
            <span className="badge bg-warning">I planifikuar</span>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4">
          <i className="fas fa-calendar-plus fa-2x mb-2"></i>
          <p className="mb-0">Nuk keni takime të ardhshme</p>
        </div>
      )}
    </div>
  );
}

export default PacientDashboard;