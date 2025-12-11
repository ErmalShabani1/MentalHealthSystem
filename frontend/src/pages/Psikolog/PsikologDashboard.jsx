import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTakimetByPsikologId } from "../../services/AppointmentService";
import { logoutUser } from "../../services/authService";
import { getAllRaportet } from "../../services/RaportService";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function PsikologDashboard() {
  const navigate = useNavigate();
  const [takimet, setTakimet] = useState([]);
  const [raportet, setRaportet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Merr të dhënat e psikologit nga localStorage
  const psikologId = localStorage.getItem("psikologId");
  const psikologName = localStorage.getItem("psikologName");
  const psikologUsername = localStorage.getItem("psikologUsername");
  const psikologEmail = localStorage.getItem("psikologEmail");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!psikologId) {
        console.error('Nuk ka psikologId në localStorage');
        setError('Nuk është gjetur ID e psikologut');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Merr të dhënat paralelisht
        const [takimetRes, raportetRes] = await Promise.all([
          getTakimetByPsikologId(psikologId),
          getAllRaportet()
        ]);

        // Procesimi i takimeve
        const takimetData = takimetRes.data || [];
        setTakimet(takimetData);

        // Procesimi i raporteve - filtro për psikologin aktual
        const allRaportet = raportetRes.data || [];
        const filteredRaportet = allRaportet.filter(rap => {
          const stringPsikologId = psikologId.toString().toLowerCase();
          
          const matchesId = 
            (rap.psikologId && rap.psikologId.toString().toLowerCase() === stringPsikologId) ||
            (rap.createdBy && rap.createdBy.toString().toLowerCase() === stringPsikologId) ||
            (rap.userId && rap.userId.toString().toLowerCase() === stringPsikologId) ||
            (rap.psikolog_id && rap.psikolog_id.toString().toLowerCase() === stringPsikologId) ||
            (rap.doctorId && rap.doctorId.toString().toLowerCase() === stringPsikologId) ||
            (rap.therapistId && rap.therapistId.toString().toLowerCase() === stringPsikologId);

          const matchesName = 
            (rap.psikologName && rap.psikologName.toLowerCase() === (psikologName || '').toLowerCase()) ||
            (rap.doctorName && rap.doctorName.toLowerCase() === (psikologName || '').toLowerCase()) ||
            (rap.therapistName && rap.therapistName.toLowerCase() === (psikologName || '').toLowerCase()) ||
            (rap.createdByName && rap.createdByName.toLowerCase() === (psikologName || '').toLowerCase());

          const matchesUsername = 
            (rap.psikologUsername && rap.psikologUsername.toLowerCase() === (psikologUsername || '').toLowerCase()) ||
            (rap.doctorEmail && rap.doctorEmail.toLowerCase() === (psikologEmail || '').toLowerCase());

          return matchesId || matchesName || matchesUsername;
        });

        setRaportet(filteredRaportet);

      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
        setError('Gabim gjatë ngarkimit të të dhënave');
        setTakimet([]);
        setRaportet([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [psikologId, psikologName, psikologUsername, psikologEmail]);

  // Llogarit statistikat - TAKIMET
  const takimetCount = takimet.length;
  const completedAppointments = takimet.filter(app => 
    app.status === "Completed" || app.status === "completed"
  ).length;
  
  const upcomingAppointments = takimet.filter(app => {
    const appointmentDate = new Date(app.appointmentDate);
    const today = new Date();
    return appointmentDate > today && (app.status === "Scheduled" || app.status === "scheduled");
  }).length;
  
  const todayAppointments = takimet.filter(app => {
    const today = new Date().toDateString();
    const appointmentDate = new Date(app.appointmentDate).toDateString();
    return appointmentDate === today;
  }).length;

  const uniquePatients = [...new Set(takimet.map(app => app.patientName || app.pacientName).filter(Boolean))].length;

  // Llogarit statistikat - RAPORTET
  const raportetCount = raportet.length;
  
  const raportetThisMonth = raportet.filter(rap => {
    try {
      const reportDate = new Date(rap.createdAt || rap.date || rap.createdDate);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && 
             reportDate.getFullYear() === now.getFullYear();
    } catch (e) {
      return false;
    }
  }).length;
  
  const updatedReports = raportet.filter(rap => {
    return rap.updatedAt && rap.updatedAt !== rap.createdAt && rap.updatedAt !== (rap.date || rap.createdDate);
  }).length;
  
  const uniquePatientsWithReports = [...new Set(raportet.map(rap => 
    rap.patientName || rap.pacientName || 'Pacient i panjohur'
  ).filter(name => name !== 'Pacient i panjohur'))].length;

  // Përgatit të dhëna për grafikët
  const chartData = [
    { name: 'Takime', value: takimetCount },
    { name: 'Raporte', value: raportetCount },
    { name: 'Pacientë', value: uniquePatients },
    { name: 'Përfunduar', value: completedAppointments },
  ];

  const statusData = [
    { name: 'Përfunduar', value: completedAppointments, color: '#10b981' },
    { name: 'Në Pritje', value: upcomingAppointments, color: '#f59e0b' },
    { name: 'Sot', value: todayAppointments, color: '#3b82f6' },
  ];

  const monthlyData = [
    { month: 'Jan', takime: 4, raporte: 2 },
    { month: 'Shk', takime: 7, raporte: 5 },
    { month: 'Mar', takime: 6, raporte: 3 },
    { month: 'Pri', takime: 8, raporte: 6 },
    { month: 'Maj', takime: 5, raporte: 4 },
    { month: 'Qer', takime: 9, raporte: 7 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-2 d-flex flex-column"
        style={{ 
          width: "180px", 
          position: "fixed", 
          height: "100vh",
          overflowY: "auto"
        }}
      >
        {/* Dashboard */}
        <div className="mb-2">
          <Link to="/psikologDashboard" className="nav-link text-white px-2 py-1 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px', fontSize: '0.85rem'}}>
            🏠 Dashboard
          </Link>
        </div>

        {/* Psikologët Section */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>👨‍⚕️ Psikologët</small>
          </div>
          <Link to="/add-takimet" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            ➕ Shto Takim
          </Link>
          <Link to="/menaxhoTakimet" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            👨‍⚕️ Menaxho
          </Link>
        </div>

        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>
              💪 Ushtrimet
            </small>
          </div>
          <Link to="/add-ushtrim" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            ➕ Shto
          </Link>
          <Link to="/menaxho-ushtrimet" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            📊 Menaxho
          </Link>
        </div>

        {/* Terapia Section */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>🧘 Terapia</small>
          </div>
          <Link to="/add-terapine" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            ➕ Shto
          </Link>
          <Link to="/menaxhoTerapine" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            📋 Menaxho
          </Link>
        </div>

        {/* Treatment Plan Section */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>📋 Plan</small>
          </div>
          <Link to="/add-treatmentplan" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            ➕ Shto
          </Link>
          <Link to="/menaxho-treatmentplan" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            📊 Menaxho
          </Link>
        </div>

        {/* Pacientët Section */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>📖 Pacientët</small>
          </div>
          <Link to="/add-raportin" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            ➕ Raport
          </Link>
          <Link to="/menaxhoRaportet" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            👨‍⚕️ Menaxho
          </Link>
          <Link to="/pacientetEMi" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            👥 Pacientët
          </Link>
        </div>

        {/* News Section */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>📰 News</small>
          </div>
          <Link to="/add-news" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            ➕ Shto
          </Link>
          <Link to="/menaxhoNews" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            📋 Menaxho
          </Link>
          <Link to="/newsList" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            👁️ Shiko
          </Link>
        </div>
                
        <div className="mt-auto">
          <button onClick={handleLogout} className="btn btn-danger btn-sm w-100 py-1" style={{fontSize: '0.8rem'}}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "180px", backgroundColor: "#f8f9fa", overflowY: "auto", height: "100vh" }}>
        <div className="container-fluid py-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 fw-bold">Dashboard i Psikologut</h4>
            <div className="text-muted" style={{fontSize: '0.9rem'}}>
              {new Date().toLocaleDateString('sq-AL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {error && (
            <div className="alert alert-warning alert-dismissible fade show py-2" role="alert" style={{fontSize: '0.85rem'}}>
              <strong>Kujdes!</strong> {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Duke ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar të dhënat...</p>
            </div>
          ) : (
            <>
              {/* Statistikat kryesore */}
              <div className="row g-3 mb-4">
                <div className="col-xl-2 col-md-4 col-sm-6">
                  <div className="card border-start-primary border-3 h-100">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-primary mb-1">Takimet Sot</div>
                          <div className="h4 mb-0 fw-bold">{todayAppointments}</div>
                          <div className="small text-muted" style={{fontSize: '0.75rem'}}>Planifikuar</div>
                        </div>
                        <div className="ms-2">
                          <span className="text-primary" style={{fontSize: '1.8rem'}}>📅</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6">
                  <div className="card border-start-success border-3 h-100">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-success mb-1">Përfunduar</div>
                          <div className="h4 mb-0 fw-bold">{completedAppointments}</div>
                          <div className="small text-muted" style={{fontSize: '0.75rem'}}>Total takime</div>
                        </div>
                        <div className="ms-2">
                          <span className="text-success" style={{fontSize: '1.8rem'}}>✅</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6">
                  <div className="card border-start-info border-3 h-100">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-info mb-1">Në Pritje</div>
                          <div className="h4 mb-0 fw-bold">{upcomingAppointments}</div>
                          <div className="small text-muted" style={{fontSize: '0.75rem'}}>Takime të ardhshme</div>
                        </div>
                        <div className="ms-2">
                          <span className="text-info" style={{fontSize: '1.8rem'}}>⏰</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6">
                  <div className="card border-start-warning border-3 h-100">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-warning mb-1">Pacientë</div>
                          <div className="h4 mb-0 fw-bold">{uniquePatients}</div>
                          <div className="small text-muted" style={{fontSize: '0.75rem'}}>Në kujdes</div>
                        </div>
                        <div className="ms-2">
                          <span className="text-warning" style={{fontSize: '1.8rem'}}>👥</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6">
                  <div className="card border-start-danger border-3 h-100">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-danger mb-1">Raporte</div>
                          <div className="h4 mb-0 fw-bold">{raportetCount}</div>
                          <div className="small text-muted" style={{fontSize: '0.75rem'}}>Të shkruara</div>
                        </div>
                        <div className="ms-2">
                          <span className="text-danger" style={{fontSize: '1.8rem'}}>📋</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6">
                  <div className="card border-start-purple border-3 h-100">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-purple mb-1">Këtë Muaj</div>
                          <div className="h4 mb-0 fw-bold">{raportetThisMonth}</div>
                          <div className="small text-muted" style={{fontSize: '0.75rem'}}>Raporte të reja</div>
                        </div>
                        <div className="ms-2">
                          <span className="text-purple" style={{fontSize: '1.8rem'}}>📈</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grafikët */}
              <div className="row g-3 mb-4">
                <div className="col-lg-4">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Statistika të Përgjithshme</h6>
                    </div>
                    <div className="card-body p-2">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Statusi i Takimeve</h6>
                    </div>
                    <div className="card-body p-2">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={statusData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Trendi Mujor</h6>
                    </div>
                    <div className="card-body p-2">
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="takime" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="raporte" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Takimet dhe Raportet */}
              <div className="row g-3">
                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Takimet e Sotme</h6>
                      <span className="badge bg-primary">{todayAppointments}</span>
                    </div>
                    <div className="card-body p-0" style={{maxHeight: '250px', overflowY: 'auto'}}>
                      <TodayAppointments appointments={takimet} />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Takimet e Ardhshme</h6>
                      <span className="badge bg-warning">{upcomingAppointments}</span>
                    </div>
                    <div className="card-body p-0" style={{maxHeight: '250px', overflowY: 'auto'}}>
                      <UpcomingAppointments appointments={takimet} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Raportet e Fundit */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Raportet e Fundit</h6>
                      <Link to="/add-raportin" className="btn btn-sm btn-success">
                        <i className="fas fa-plus me-1"></i>
                        Shto Raport
                      </Link>
                    </div>
                    <div className="card-body p-0" style={{maxHeight: '250px', overflowY: 'auto'}}>
                      <RecentReports reports={raportet} />
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

// Komponenti për takimet e sotme (i përditësuar)
function TodayAppointments({ appointments }) {
  const todayAppointments = appointments.filter(app => {
    const today = new Date().toDateString();
    const appointmentDate = new Date(app.appointmentDate).toDateString();
    return appointmentDate === today;
  });

  return (
    <div className="list-group list-group-flush">
      {todayAppointments.length > 0 ? (
        todayAppointments.map((appointment, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
            <div className="d-flex align-items-center">
              <div className={`rounded-circle p-2 me-3 ${appointment.status === 'Completed' || appointment.status === 'completed' ? 'bg-success' : 
                appointment.status === 'Cancelled' || appointment.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`} style={{width: '35px', height: '35px'}}>
                <span className="text-white" style={{fontSize: '0.8rem'}}>
                  {appointment.status === 'Completed' || appointment.status === 'completed' ? '✓' : 
                   appointment.status === 'Cancelled' || appointment.status === 'cancelled' ? '✗' : '○'}
                </span>
              </div>
              <div>
                <h6 className="mb-0" style={{fontSize: '0.9rem'}}>{appointment.patientName || appointment.pacientName || 'Pacient'}</h6>
                <small className="text-muted" style={{fontSize: '0.75rem'}}>
                  {appointment.notes ? `${appointment.notes.substring(0, 25)}...` : "Pa shënime"}
                </small>
              </div>
            </div>
            <div className="text-end">
              <div className="fw-bold" style={{fontSize: '0.9rem'}}>
                {new Date(appointment.appointmentDate).toLocaleTimeString('sq-AL', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <small className="badge bg-secondary" style={{fontSize: '0.7rem'}}>
                {appointment.appointmentType || 'Konsultim'}
              </small>
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4" style={{fontSize: '0.9rem'}}>
          Nuk ka takime për sot
        </div>
      )}
    </div>
  );
}

// Komponenti për takimet e ardhshme (i përditësuar)
function UpcomingAppointments({ appointments }) {
  const upcomingAppointments = appointments
    .filter(app => {
      const appointmentDate = new Date(app.appointmentDate);
      const today = new Date();
      return appointmentDate > today && (app.status === "Scheduled" || app.status === "scheduled");
    })
    .slice(0, 5);

  return (
    <div className="list-group list-group-flush">
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment, index) => (
          <div key={index} className="list-group-item py-2 px-3 border-bottom">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                  <span style={{fontSize: '1rem'}}>
                    {new Date(appointment.appointmentDate).getDate()}
                  </span>
                </div>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0" style={{fontSize: '0.9rem'}}>
                  {appointment.patientName || appointment.pacientName}
                </h6>
                <div className="d-flex justify-content-between" style={{fontSize: '0.75rem'}}>
                  <span className="text-muted">
                    {new Date(appointment.appointmentDate).toLocaleDateString('sq-AL', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-primary fw-semibold">
                    {new Date(appointment.appointmentDate).toLocaleTimeString('sq-AL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4" style={{fontSize: '0.9rem'}}>
          Nuk ka takime të ardhshme
        </div>
      )}
    </div>
  );
}

// Komponenti për raportet e fundit (i përditësuar)
function RecentReports({ reports }) {
  const recentReports = reports
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt || b.date || b.createdDate) - new Date(a.createdAt || a.date || a.createdDate));

  return (
    <div className="list-group list-group-flush">
      {recentReports.length > 0 ? (
        recentReports.map((report, index) => (
          <div key={index} className="list-group-item py-2 px-3">
            <div className="d-flex align-items-center">
              <div className="bg-light text-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '35px', height: '35px'}}>
                <span style={{fontSize: '1rem'}}>📋</span>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0" style={{fontSize: '0.9rem'}}>
                  {report.title || 'Raport pa titull'}
                </h6>
                <div className="d-flex justify-content-between align-items-center" style={{fontSize: '0.75rem'}}>
                  <span className="text-muted">
                    {report.patientName || report.pacientName || 'Pacient'}
                  </span>
                  <span className="badge bg-info text-dark" style={{fontSize: '0.7rem'}}>
                    {new Date(report.createdAt || report.date || report.createdDate).toLocaleDateString('sq-AL')}
                  </span>
                </div>
              </div>
              <div className="ms-2">
                <span className="badge bg-warning text-dark" style={{fontSize: '0.7rem'}}>
                  {(report.diagnoza || report.diagnosis || 'Pa diagnozë').substring(0, 15)}...
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4" style={{fontSize: '0.9rem'}}>
          <i className="fas fa-file-medical fa-2x mb-2 d-block text-muted"></i>
          <p className="mb-0">Nuk ka raporte të shkruara</p>
        </div>
      )}
    </div>
  );
}

export default PsikologDashboard;