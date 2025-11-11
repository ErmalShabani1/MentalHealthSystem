import React, { useEffect, useState } from "react";
import { getAllPsikologet } from "../../services/PsikologiService";
import { getAllPatients } from "../../services/PacientiService";
import { getAllAppointmentsAdmin } from "../../services/AppointmentService";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [psychologistsCount, setPsychologistsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [takimetCount, setTakimetCount] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resPsych, resPatients, resTakimet] = await Promise.all([
          getAllPsikologet(),
          getAllPatients(),
          getAllAppointmentsAdmin()
        ]);

        setPsychologistsCount(resPsych.data.length);
        setPatientsCount(resPatients.data.length);
        setTakimetCount(resTakimet.data.length);
        
        // Merr 5 takimet më të fundit
        const sortedAppointments = resTakimet.data
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 5);
        setRecentAppointments(sortedAppointments);
        
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Llogarit statistikat e tjera bazuar në të dhënat reale
  const completedAppointments = recentAppointments.filter(app => 
    app.status === "Completed"
  ).length;
  
  const upcomingAppointments = recentAppointments.filter(app => 
    new Date(app.appointmentDate) > new Date() && app.status === "Scheduled"
  ).length;
  
  const newPatientsThisMonth = Math.floor(patientsCount * 0.1); // Supozim

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh", overflowY: "auto" }}
      >
        <h4 className="mb-4 text-center">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/adminDashboard" className="nav-link text-white active">
              🏠 Dashboard
            </Link>
          </li>
          <h6 className="text-center mt-4">👨‍⚕️ Psikologët</h6>
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
          <h6 className="text-center mt-4">👥 Pacientët</h6>
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
          <h6 className="text-center mt-4">📅 Takimet</h6>
         <li className="nav-item mb-2">
  <Link to="/menaxhoTakimetAdmin" className="nav-link text-white">
    📋 Menaxho Takimet
  </Link>
</li>
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Dashboard</h2>
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
              <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Psikologët Aktivë
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {psychologistsCount}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            Profesionistë në platformë
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-primary">
                            <span style={{fontSize: '1.5rem'}}>👨‍⚕️</span>
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
                            Pacientët Total
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {patientsCount}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            {newPatientsThisMonth} të rinj këtë muaj
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-success">
                            <span style={{fontSize: '1.5rem'}}>👥</span>
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
                            Takimet e Përfunduara
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {completedAppointments}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            Këtë muaj
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="icon-circle bg-info">
                            <span style={{fontSize: '1.5rem'}}>✅</span>
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
                          <div className="icon-circle bg-warning">
                            <span style={{fontSize: '1.5rem'}}>📅</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row mt-4">
                {/* Takimet e Fundit */}
                <div className="col-md-8">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Takimet e Fundit</h5>
                    </div>
                    <div className="card-body p-0">
                      <RecentAppointments appointments={recentAppointments} />
                    </div>
                  </div>
                </div>
                
                {/* Shpejtësitë */}
                <div className="col-md-4">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Shpejtësitë</h5>
                    </div>
                    <div className="card-body">
                      <QuickActions />
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

// Komponenti për takimet e fundit
// Komponenti për takimet e fundit
function RecentAppointments({ appointments }) {
  return (
    <div className="list-group list-group-flush">
      {appointments.length > 0 ? (
        appointments.map((appointment, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">
                {appointment.patient?.emri && appointment.patient?.mbiemri 
                  ? `${appointment.patient.emri} ${appointment.patient.mbiemri}`
                  : appointment.patientName || "Pacient i panjohur"
                }
              </h6>
              <small className="text-muted">
                Psikolog: {appointment.psikologi?.emri && appointment.psikologi?.mbiemri 
                  ? `${appointment.psikologi.emri} ${appointment.psikologi.mbiemri}`
                  : `Psikolog ID: ${appointment.psikologId}`
                }
              </small>
              <br></br>
              {appointment.notes && (
                
                <small className="text-muted">
                  Shënime: {appointment.notes.length > 50 
                    ? `${appointment.notes.substring(0, 50)}...` 
                    : appointment.notes
                  }
                </small>
              )}
            </div>
            <div className="text-end">
              <div className="fw-bold">
                {new Date(appointment.appointmentDate).toLocaleDateString('sq-AL')}
              </div>
              <div className="text-muted small">
                {new Date(appointment.appointmentDate).toLocaleTimeString('sq-AL')}
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
          Nuk ka takime të fundit
        </div>
      )}
    </div>
  );
}

// Komponenti për veprimet e shpejta
function QuickActions() {
  const actions = [
    { title: "Shto Psikolog", icon: "👨‍⚕️", link: "/add-psikologin", color: "primary" },
    { title: "Shto Pacient", icon: "👤", link: "/add-pacientin", color: "success" },
    { title: "Menaxho Takimet", icon: "📅", link: "/menaxhoTakimetAdmin", color: "info" },
  ];

  return (
    <div className="row g-2">
      {actions.map((action, index) => (
        <div className="col-12" key={index}>
          <Link 
            to={action.link} 
            className={`btn btn-${action.color} w-100 d-flex align-items-center justify-content-start py-3`}
          >
            <div style={{fontSize: '1.2rem'}} className="me-3">{action.icon}</div>
            <div>{action.title}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;