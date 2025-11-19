import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTakimetByPsikologId } from "../../services/AppointmentService";
import { logoutUser } from "../../services/authService";
import { getRaportetByPsikologId } from "../../services/RaportService";
import { getAllRaportet } from "../../services/RaportService";


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
        
        console.log('=== DEBUG INFORMATION ===');
        console.log('Psikolog ID:', psikologId);
        console.log('Psikolog Name:', psikologName);
        console.log('Psikolog Username:', psikologUsername);
        console.log('Psikolog Email:', psikologEmail);

        // Merr të dhënat paralelisht
        const [takimetRes, raportetRes] = await Promise.all([
          getTakimetByPsikologId(psikologId),
          getAllRaportet()
        ]);

        console.log('Takimet e marra:', takimetRes.data);
        console.log('Të gjitha raportet nga API:', raportetRes.data);

        // Procesimi i takimeve
        const takimetData = takimetRes.data || [];
        setTakimet(takimetData);

        // Procesimi i raporteve - filtro për psikologin aktual
        const allRaportet = raportetRes.data || [];
        console.log('Numri i të gjitha raporteve:', allRaportet.length);

        // Filtro raportet për psikologin aktual duke kontrolluar të gjitha fushat e mundshme
        const filteredRaportet = allRaportet.filter(rap => {
          const stringPsikologId = psikologId.toString().toLowerCase();
          
          // Kontrollo të gjitha fushat e mundshme ku mund të jetë ID e psikologit
          const matchesId = 
            (rap.psikologId && rap.psikologId.toString().toLowerCase() === stringPsikologId) ||
            (rap.createdBy && rap.createdBy.toString().toLowerCase() === stringPsikologId) ||
            (rap.userId && rap.userId.toString().toLowerCase() === stringPsikologId) ||
            (rap.psikolog_id && rap.psikolog_id.toString().toLowerCase() === stringPsikologId) ||
            (rap.doctorId && rap.doctorId.toString().toLowerCase() === stringPsikologId) ||
            (rap.therapistId && rap.therapistId.toString().toLowerCase() === stringPsikologId);

          // Kontrollo emrat e mundshëm
          const matchesName = 
            (rap.psikologName && rap.psikologName.toLowerCase() === (psikologName || '').toLowerCase()) ||
            (rap.doctorName && rap.doctorName.toLowerCase() === (psikologName || '').toLowerCase()) ||
            (rap.therapistName && rap.therapistName.toLowerCase() === (psikologName || '').toLowerCase()) ||
            (rap.createdByName && rap.createdByName.toLowerCase() === (psikologName || '').toLowerCase());

          // Kontrollo username/email
          const matchesUsername = 
            (rap.psikologUsername && rap.psikologUsername.toLowerCase() === (psikologUsername || '').toLowerCase()) ||
            (rap.doctorEmail && rap.doctorEmail.toLowerCase() === (psikologEmail || '').toLowerCase());

          return matchesId || matchesName || matchesUsername;
        });

        console.log('Raportet e filtruara për psikologin:', filteredRaportet);
        console.log('Numri i raporteve të filtruara:', filteredRaportet.length);

        // Nëse nuk gjej raporte, provo me të dhëna testuese për të testuar komponentin
        if (filteredRaportet.length === 0 && allRaportet.length > 0) {
          console.warn('Nuk u gjetën raporte për këtë psikolog, por ka raporte në database');
          console.log('Raporti i parë për referencë:', allRaportet[0]);
          console.log('Të gjitha fushat e raportit të parë:', Object.keys(allRaportet[0]));
        }

        setRaportet(filteredRaportet);

      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
        setError('Gabim gjatë ngarkimit të të dhënave');
        
        // Në rast gabimi, përdor të dhëna testuese për të testuar komponentin
        const testRaportet = [
          {
            id: 1,
            title: "Raport Test 1",
            patientName: "Pacient Test 1",
            diagnoza: "Anxiety Disorder",
            psikologId: psikologId,
            psikologName: psikologName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            title: "Raport Test 2", 
            patientName: "Pacient Test 2",
            diagnoza: "Depression",
            psikologId: psikologId,
            psikologName: psikologName,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString()
          }
        ];
        setRaportet(testRaportet);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [psikologId, psikologName, psikologUsername, psikologEmail]);

  // Llogarit statistikat nga të dhënat reale - TAKIMET
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

  // Llogarit statistikat nga të dhënat reale - RAPORTET
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

          {error && (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
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
              {/* Statistikat e Takimeve */}
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

              
             

              {/* Takimet e Sotme dhe të Ardhshme */}
              <div className="row mt-4">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Komponenti për takimet e sotme
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
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">{appointment.patientName || appointment.pacientName}</h6>
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
                appointment.status === 'Completed' || appointment.status === 'completed' ? 'bg-success' : 
                appointment.status === 'Cancelled' || appointment.status === 'cancelled' ? 'bg-danger' : 'bg-warning'
              }`}>
                {appointment.status === 'Completed' || appointment.status === 'completed' ? 'Përfunduar' : 
                 appointment.status === 'Cancelled' || appointment.status === 'cancelled' ? 'Anuluar' : 'Në pritje'}
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

// Komponenti për takimet e ardhshme
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
          <div key={index} className="list-group-item px-0 py-2 border-0">
            <div className="d-flex align-items-start">
              <div className="me-3 text-primary" style={{fontSize: '1.2rem'}}>
                📅
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0" style={{fontSize: '0.9rem'}}>{appointment.patientName || appointment.pacientName}</h6>
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

// Komponenti për raportet e fundit
function RecentReports({ reports }) {
  console.log('Raportet në RecentReports:', reports);
  
  const recentReports = reports
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt || b.date || b.createdDate) - new Date(a.createdAt || a.date || a.createdDate));

  return (
    <div className="list-group list-group-flush">
      {recentReports.length > 0 ? (
        recentReports.map((report, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="flex-grow-1">
              <h6 className="mb-1 text-success">{report.title || 'Raport pa titull'}</h6>
              <small className="text-muted d-block">
                Pacienti: <strong>{report.patientName || report.pacientName || 'Pacient i panjohur'}</strong>
              </small>
              <small className="text-muted">
                Data: {new Date(report.createdAt || report.date || report.createdDate).toLocaleDateString('sq-AL')}
                {report.updatedAt && report.updatedAt !== report.createdAt && (
                  <span className="text-info ms-2">
                    <i className="fas fa-edit me-1"></i>
                    Përditësuar
                  </span>
                )}
              </small>
            </div>
            <div className="text-end">
              <span className="badge bg-warning text-dark" title={report.diagnoza || report.diagnosis}>
                {(report.diagnoza || report.diagnosis || 'Pa diagnozë').length > 25 
                  ? `${(report.diagnoza || report.diagnosis || 'Pa diagnozë').substring(0, 25)}...` 
                  : (report.diagnoza || report.diagnosis || 'Pa diagnozë')
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