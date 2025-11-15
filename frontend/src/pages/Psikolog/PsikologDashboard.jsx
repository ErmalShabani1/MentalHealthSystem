import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTakimetByPsikologId } from "../../services/AppointmentService";
import { logoutUser } from "../../services/authService";
import { getRaportetByPsikologId } from "../../services/RaportService";

function PsikologDashboard() {
  const navigate = useNavigate();
  const [takimet, setTakimet] = useState([]);
  const [raportet, setRaportet] = useState([]);
  const [loading, setLoading] = useState(true);
  const psikologId = localStorage.getItem("psikologId");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!psikologId) return;

      try {
        setLoading(true);
        
        // Merr të dhënat paralelisht
        const [takimetRes, raportetRes] = await Promise.all([
          getTakimetByPsikologId(psikologId),
          getRaportetByPsikologId(psikologId)
        ]);
        
        setTakimet(takimetRes.data);
        setRaportet(raportetRes.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [psikologId]);

  // Llogarit statistikat nga të dhënat reale - TAKIMET
  const takimetCount = takimet.length;
  const completedAppointments = takimet.filter(app => 
    app.status === "Completed"
  ).length;
  
  const upcomingAppointments = takimet.filter(app => 
    new Date(app.appointmentDate) > new Date() && app.status === "Scheduled"
  ).length;
  
  const todayAppointments = takimet.filter(app => {
    const today = new Date().toDateString();
    return new Date(app.appointmentDate).toDateString() === today;
  }).length;

  const uniquePatients = [...new Set(takimet.map(app => app.patientName))].length;

  // Llogarit statistikat nga të dhënat reale - RAPORTET
  const raportetCount = raportet.length;
  const raportetThisMonth = raportet.filter(rap => {
    const reportDate = new Date(rap.createdAt);
    const now = new Date();
    return reportDate.getMonth() === now.getMonth() && 
           reportDate.getFullYear() === now.getFullYear();
  }).length;
  
  const updatedReports = raportet.filter(rap => rap.updatedAt && rap.updatedAt !== rap.createdAt).length;
  const uniquePatientsWithReports = [...new Set(raportet.map(rap => rap.patientName))].length;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh", overflowY: "auto" }}
      >
        <h4 className="mb-4 text-center">Psikolog Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/psikologDashboard" className="nav-link text-white active">
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
            <Link to="/add-raportin" className="nav-link text-white">
              📝 Shto Raport
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoRaportet" className="nav-link text-white">
              📊 Menaxho Raportet
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/pacientetEMi" className="nav-link text-white">
              👥 Pacientët e Mi
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
            <h2 className="mb-0">Dashboard i Psikologut</h2>
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
              {/* Statistikat - PAMJA E TASHME (NUK NDRYSHO) */}
              <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Takimet Sot
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {todayAppointments}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            {todayAppointments > 0 ? 'Takime të planifikuara' : 'Nuk ka takime sot'}
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-primary">
                            <span style={{fontSize: '1.5rem'}}>📅</span>
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
                            Takimet e Përfunduara
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {completedAppointments}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            Total
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-success">
                            <span style={{fontSize: '1.5rem'}}>✅</span>
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
                            Takimet e Ardhshme
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {upcomingAppointments}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            Në pritje
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-info">
                            <span style={{fontSize: '1.5rem'}}>⏰</span>
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
                            Pacientët e Mi
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {uniquePatients}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            Në kujdes
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-warning">
                            <span style={{fontSize: '1.5rem'}}>👥</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row mt-4">
                {/* Takimet e Sotme */}
                <div className="col-md-8">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Takimet e Sotme</h5>
                    </div>
                    <div className="card-body p-0">
                      <TodayAppointments appointments={takimet} />
                    </div>
                  </div>
                </div>
                
                {/* Takimet e Ardhshme */}
                <div className="col-md-4">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Takimet e Ardhshme</h5>
                    </div>
                    <div className="card-body p-0">
                      <UpcomingAppointments appointments={takimet} />
                    </div>
                  </div>
                </div>
              </div>

              {/* SEKSIONI I RI - STATISTIKAT E RAPORTEVE */}
              <div className="row mt-5">
                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-file-medical me-2"></i>
                        Statistikat e Raporteve
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-xl-3 col-md-6 mb-3">
                          <div className="card bg-light border-0">
                            <div className="card-body text-center">
                              <div className="text-success mb-2">
                                <i className="fas fa-file-medical fa-2x"></i>
                              </div>
                              <h3 className="text-success">{raportetCount}</h3>
                              <p className="mb-0 text-muted">Total Raporte</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-3">
                          <div className="card bg-light border-0">
                            <div className="card-body text-center">
                              <div className="text-info mb-2">
                                <i className="fas fa-calendar fa-2x"></i>
                              </div>
                              <h3 className="text-info">{raportetThisMonth}</h3>
                              <p className="mb-0 text-muted">Këtë Muaj</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-3">
                          <div className="card bg-light border-0">
                            <div className="card-body text-center">
                              <div className="text-warning mb-2">
                                <i className="fas fa-edit fa-2x"></i>
                              </div>
                              <h3 className="text-warning">{updatedReports}</h3>
                              <p className="mb-0 text-muted">Të Përditësuara</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-3">
                          <div className="card bg-light border-0">
                            <div className="card-body text-center">
                              <div className="text-primary mb-2">
                                <i className="fas fa-user-md fa-2x"></i>
                              </div>
                              <h3 className="text-primary">{uniquePatientsWithReports}</h3>
                              <p className="mb-0 text-muted">Pacientë me Raporte</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Raportet e Fundit */}
                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Raportet e Fundit</h6>
                          <Link to="/menaxhoRaportet" className="btn btn-sm btn-outline-success">
                            Shiko të Gjitha
                          </Link>
                        </div>
                        <RecentReports reports={raportet} />
                      </div>
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

// Komponenti për takimet e sotme (I NJËJTË)
function TodayAppointments({ appointments }) {
  const todayAppointments = appointments.filter(app => {
    const today = new Date().toDateString();
    return new Date(app.appointmentDate).toDateString() === today;
  });

  return (
    <div className="list-group list-group-flush">
      {todayAppointments.length > 0 ? (
        todayAppointments.map((appointment, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">{appointment.patientName}</h6>
              <small className="text-muted">
                {appointment.notes ? `${appointment.notes.substring(0, 30)}...` : "Nuk ka shënime"}
              </small>
            </div>
            <div className="text-end">
              <div className="fw-bold">
                {new Date(appointment.appointmentDate).toLocaleTimeString('sq-AL', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <small className={`badge ${
                appointment.status === 'Completed' ? 'bg-success' : 
                appointment.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
              }`}>
                {appointment.status === 'Completed' ? 'Përfunduar' : 
                 appointment.status === 'Cancelled' ? 'Anuluar' : 'Në pritje'}
              </small>
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4">
          Nuk ka takime për sot
        </div>
      )}
    </div>
  );
}

// Komponenti për takimet e ardhshme (I NJËJTË)
function UpcomingAppointments({ appointments }) {
  const upcomingAppointments = appointments
    .filter(app => new Date(app.appointmentDate) > new Date() && app.status === "Scheduled")
    .slice(0, 5);

  return (
    <div className="list-group list-group-flush">
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment, index) => (
          <div key={index} className="list-group-item px-0 py-2 border-0">
            <div className="d-flex align-items-start">
              <div className="me-3 text-primary" style={{fontSize: '1.2rem'}}>
                📅
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0" style={{fontSize: '0.9rem'}}>{appointment.patientName}</h6>
                <small className="text-muted">
                  {new Date(appointment.appointmentDate).toLocaleDateString('sq-AL')}
                </small>
                <br />
                <small className="text-muted">
                  {new Date(appointment.appointmentDate).toLocaleTimeString('sq-AL', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </small>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4">
          Nuk ka takime të ardhshme
        </div>
      )}
    </div>
  );
}

// Komponenti i RI për raportet e fundit
function RecentReports({ reports }) {
  const recentReports = reports
    .slice(0, 5) // Merr 5 raportet e fundit
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="list-group list-group-flush">
      {recentReports.length > 0 ? (
        recentReports.map((report, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="flex-grow-1">
              <h6 className="mb-1 text-success">{report.title}</h6>
              <small className="text-muted d-block">
                Pacienti: <strong>{report.patientName}</strong>
              </small>
              <small className="text-muted">
                Data: {new Date(report.createdAt).toLocaleDateString('sq-AL')}
                {report.updatedAt && report.updatedAt !== report.createdAt && (
                  <span className="text-info ms-2">
                    <i className="fas fa-edit me-1"></i>
                    Përditësuar
                  </span>
                )}
              </small>
            </div>
            <div className="text-end">
              <span className="badge bg-warning text-dark" title={report.diagnoza}>
                {report.diagnoza.length > 25 
                  ? `${report.diagnoza.substring(0, 25)}...` 
                  : report.diagnoza
                }
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-3">
          <i className="fas fa-file-medical fa-2x mb-2 d-block"></i>
          <p className="mb-2">Nuk ka raporte të shkruara</p>
          <Link to="/add-raportin" className="btn btn-sm btn-success">
            <i className="fas fa-plus me-1"></i>
            Shto Raport të Parë
          </Link>
        </div>
      )}
    </div>
  );
}

export default PsikologDashboard;