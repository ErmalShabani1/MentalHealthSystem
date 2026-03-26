import React, { useEffect, useState } from "react";
import { getAllPsikologet } from "../../services/PsikologiService";
import { getAllPatients } from "../../services/PacientiService";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import { getTakimetByPsikologId } from "../../services/AppointmentService";
import { getAllRaportet } from "../../services/RaportService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [psychologistsCount, setPsychologistsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [takimetCount, setTakimetCount] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [allTakimet, setAllTakimet] = useState([]);
  const [raportetCount, setRaportetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Merr psikologët dhe pacientët
        const [resPsych, resPatients] = await Promise.all([
          getAllPsikologet(),
          getAllPatients()
        ]);

        setPsychologistsCount(resPsych.data.length);
        setPatientsCount(resPatients.data.length);

        // Merr takimet për ÇDO psikolog
        const allTakimet = [];
        
        for (const psikolog of resPsych.data) {
          try {
            const takimetRes = await getTakimetByPsikologId(psikolog.id);
            
            if (takimetRes.data && takimetRes.data.length > 0) {
              const takimetMeDetaje = takimetRes.data.map(takim => ({
                ...takim,
                psikologName: `${psikolog.name} ${psikolog.surname}`,
                psikologId: psikolog.id
              }));
              
              allTakimet.push(...takimetMeDetaje);
            }
          } catch (error) {
            console.log(`Nuk u morën takimet për psikolog ${psikolog.id}:`, error.message);
          }
        }
        
        setTakimetCount(allTakimet.length);
        setAllTakimet(allTakimet);
        
        // Merr 5 takimet më të fundit
        const sortedAppointments = allTakimet
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 5);
        setRecentAppointments(sortedAppointments);
        try {
  const raportetRes = await getAllRaportet();
  setRaportetCount(raportetRes.data.length);
} catch (error) {
  console.error("Gabim gjatë marrjes së raporteve:", error);
}
        
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Llogarit statistikat
  const completedAppointments = allTakimet.filter(app => 
    app.status === "Completed" || app.status === "completed"
  ).length;
  
  const upcomingAppointments = allTakimet.filter(app => 
    new Date(app.appointmentDate) > new Date() && (app.status === "Scheduled" || app.status === "scheduled")
  ).length;
  
  const todayAppointments = allTakimet.filter(app => {
    const today = new Date().toDateString();
    const appointmentDate = new Date(app.appointmentDate).toDateString();
    return appointmentDate === today;
  }).length;
  
  const newPatientsThisMonth = Math.floor(patientsCount * 0.1);
  const activePsychologists = Math.floor(psychologistsCount * 0.8);
  // Të dhëna për grafikët
  const statsData = [
    { label: 'Psikologë', value: psychologistsCount, color: '#3b82f6', icon: '👨‍⚕️' },
    { label: 'Pacientë', value: patientsCount, color: '#10b981', icon: '👥' },
    { label: 'Takime', value: takimetCount, color: '#f59e0b', icon: '📅' },
    { label: 'Raporte', value: raportetCount, color: '#8b5cf6', icon: '📋' },
  ];

  const statusData = [
    { label: 'Takimet Sot', value: todayAppointments, color: '#3b82f6' },
    { label: 'Takimet Në Pritje', value: upcomingAppointments, color: '#f59e0b' },
    { label: 'Takimet e Përfunduara', value: completedAppointments, color: '#10b981' },
  ];

  // Funksion për të llogaritur përqindjen
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

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
        <div className="text-center mb-3">
          <h6 className="mb-0 fw-bold" style={{fontSize: '0.9rem'}}>Admin Panel</h6>
        </div>

        {/* Dashboard */}
        <div className="mb-2">
          <Link to="/adminDashboard" className="nav-link text-white px-2 py-1 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px', fontSize: '0.85rem'}}>
            🏠 Dashboard
          </Link>
        </div>

        {/* Përdoruesit */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>👥 Përdoruesit</small>
          </div>
          <Link to="/menaxhoUserat" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            👤 Menaxho
          </Link>
        </div>

        {/* Psikologët */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>👨‍⚕️ Psikologët</small>
          </div>
          <Link to="/add-psikologin" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            ➕ Shto
          </Link>
          <Link to="/menaxhoPsikologet" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            👨‍⚕️ Menaxho
          </Link>
        </div>

        {/* Pacientët */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>👥 Pacientët</small>
          </div>
          <Link to="/add-pacientin" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            ➕ Shto
          </Link>
          <Link to="/menaxhoPacientet" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            👨‍⚕️ Menaxho
          </Link>
        </div>

        {/* Takimet */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>📅 Takimet</small>
          </div>
          <Link to="/menaxhoTakimetAdmin" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            📋 Menaxho
          </Link>
        </div>

       

        {/* Raportet */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>📊 Raportet</small>
          </div>
          <Link to="/raportet-admin" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            📈 Shiko
          </Link>
         
        </div>

        {/* Notifications Section */}
        <div className="mb-2">
          <div className="text-white mb-1 px-1 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>🔔 Njoftimet</small>
          </div>
          <Link to="/admin-notifications" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.8rem'}}>
            📋 Menaxho
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
            <h4 className="mb-0 fw-bold">Admin Dashboard</h4>
            <div className="text-muted" style={{fontSize: '0.9rem'}}>
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
              {/* Statistikat kryesore */}
              <div className="row g-3 mb-4">
  {statsData.map((stat, index) => (
    <div key={index} className="col-xl-3 col-md-4 col-sm-6">
      <div className="card border-start-primary border-3 h-100" style={{borderLeftColor: stat.color}}>
        <div className="card-body p-3">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <div className="small fw-semibold mb-1" style={{color: stat.color}}>{stat.label}</div>
              <div className="h4 mb-0 fw-bold">{stat.value}</div>
              <div className="small text-muted" style={{fontSize: '0.75rem'}}>Total në sistem</div>
            </div>
            <div className="ms-2">
              <span style={{fontSize: '2rem'}}>{stat.icon}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

              {/* Grafikët e thjeshtë */}
              <div className="row g-3 mb-4">
                <div className="col-lg-4">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Statistikat e Takimeve</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-column gap-2">
                        {statusData.map((item, index) => {
                          const total = statusData.reduce((sum, s) => sum + s.value, 0);
                          const percentage = calculatePercentage(item.value, total);
                          return (
                            <div key={index} className="d-flex align-items-center">
                              <div className="me-2" style={{width: '20px', height: '20px', backgroundColor: item.color, borderRadius: '4px'}}></div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between">
                                  <span style={{fontSize: '0.85rem'}}>{item.label}</span>
                                  <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>{item.value}</span>
                                </div>
                                <div className="progress" style={{height: '8px'}}>
                                  <div 
                                    className="progress-bar" 
                                    role="progressbar" 
                                    style={{width: `${percentage}%`, backgroundColor: item.color}}
                                    aria-valuenow={percentage} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Performanca e Platformës</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-around align-items-end" style={{height: '150px'}}>
                        <div className="text-center">
                          <div style={{height: `${(psychologistsCount/20)*100}px`, backgroundColor: '#3b82f6', width: '30px', borderRadius: '4px'}}></div>
                          <div className="mt-1 small">Psikologë</div>
                          <div className="fw-bold">{psychologistsCount}</div>
                        </div>
                        <div className="text-center">
                          <div style={{height: `${(patientsCount/100)*100}px`, backgroundColor: '#10b981', width: '30px', borderRadius: '4px'}}></div>
                          <div className="mt-1 small">Pacientë</div>
                          <div className="fw-bold">{patientsCount}</div>
                        </div>
                        <div className="text-center">
                          <div style={{height: `${(completedAppointments/50)*100}px`, backgroundColor: '#f59e0b', width: '30px', borderRadius: '4px'}}></div>
                          <div className="mt-1 small">Përfunduar</div>
                          <div className="fw-bold">{completedAppointments}</div>
                        </div>
                        <div className="text-center">
                          <div style={{height: `${(upcomingAppointments/50)*100}px`, backgroundColor: '#8b5cf6', width: '30px', borderRadius: '4px'}}></div>
                          <div className="mt-1 small">Në Pritje</div>
                          <div className="fw-bold">{upcomingAppointments}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Shpërndarja e Aktivitetit</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-wrap justify-content-center align-items-center" style={{height: '150px'}}>
                        <div className="text-center mx-3">
                          <div className="position-relative" style={{width: '80px', height: '80px'}}>
                            <div className="position-absolute rounded-circle" style={{
                              width: '80px',
                              height: '80px',
                              background: `conic-gradient(
                                #3b82f6 ${(psychologistsCount/(psychologistsCount+patientsCount+completedAppointments+upcomingAppointments))*100}%,
                                #10b981 ${(psychologistsCount/(psychologistsCount+patientsCount+completedAppointments+upcomingAppointments))*100}% ${((psychologistsCount+patientsCount)/(psychologistsCount+patientsCount+completedAppointments+upcomingAppointments))*100}%,
                                #f59e0b ${((psychologistsCount+patientsCount)/(psychologistsCount+patientsCount+completedAppointments+upcomingAppointments))*100}% ${((psychologistsCount+patientsCount+completedAppointments)/(psychologistsCount+patientsCount+completedAppointments+upcomingAppointments))*100}%,
                                #8b5cf6 ${((psychologistsCount+patientsCount+completedAppointments)/(psychologistsCount+patientsCount+completedAppointments+upcomingAppointments))*100}% 100%
                              )`
                            }}></div>
                            <div className="position-absolute bg-white rounded-circle" style={{
                              width: '60px',
                              height: '60px',
                              top: '10px',
                              left: '10px'
                            }}></div>
                          </div>
                        </div>
                        <div className="small">
                          <div className="d-flex align-items-center mb-1">
                            <div style={{width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '2px', marginRight: '5px'}}></div>
                            <span>Psikologë: {psychologistsCount}</span>
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <div style={{width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '2px', marginRight: '5px'}}></div>
                            <span>Pacientë: {patientsCount}</span>
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <div style={{width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '2px', marginRight: '5px'}}></div>
                            <span>Përfunduar: {completedAppointments}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <div style={{width: '10px', height: '10px', backgroundColor: '#8b5cf6', borderRadius: '2px', marginRight: '5px'}}></div>
                            <span>Në Pritje: {upcomingAppointments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Takimet e fundit dhe Shpejtësitë */}
              <div className="row g-3">
                <div className="col-lg-8">
                  <div className="card h-100">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Takimet e Fundit</h6>
                      <Link to="/menaxhoTakimetAdmin" className="btn btn-sm btn-primary">
                        📋 Shiko të gjitha
                      </Link>
                    </div>
                    <div className="card-body p-0" style={{maxHeight: '300px', overflowY: 'auto'}}>
                      <RecentAppointments appointments={recentAppointments} />
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Veprime të Shpejta</h6>
                    </div>
                    <div className="card-body">
                      <QuickActions />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistikat shtesë */}
              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Aktiviteti i Psikologëve</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{fontSize: '0.85rem'}}>Psikologë Aktivë</span>
                        <span className="badge bg-primary">{activePsychologists}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{fontSize: '0.85rem'}}>Takime/Psikolog</span>
                        <span className="badge bg-info">{psychologistsCount > 0 ? Math.floor(takimetCount / psychologistsCount) : 0}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{fontSize: '0.85rem'}}>Pacientë/Psikolog</span>
                        <span className="badge bg-success">{psychologistsCount > 0 ? Math.floor(patientsCount / psychologistsCount) : 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Statistikat Mujore</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{fontSize: '0.85rem'}}>Takime të reja</span>
                        <span className="badge bg-warning">{todayAppointments}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{fontSize: '0.85rem'}}>Pacientë të rinj</span>
                        <span className="badge bg-success">{newPatientsThisMonth}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{fontSize: '0.85rem'}}>Raporte gjeneruar</span>
                        <span className="badge bg-info">{raportetCount}</span>
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

// Komponenti për takimet e fundit (i përditësuar)
function RecentAppointments({ appointments }) {
  return (
    <div className="list-group list-group-flush">
      {appointments.length > 0 ? (
        appointments.map((appointment, index) => {
          const patientName = 
            appointment.patientName || 
            (appointment.patient?.emri && appointment.patient?.mbiemri 
              ? `${appointment.patient.emri} ${appointment.patient.mbiemri}`
              : `Pacient ID: ${appointment.patientId || 'N/A'}`
            );

          const psikologName = 
            appointment.psikologName ||
            (appointment.psikolog?.name && appointment.psikolog?.surname
              ? `${appointment.psikolog.name} ${appointment.psikolog.surname}`
              : `Psikolog ID: ${appointment.psikologId || 'N/A'}`
            );

          return (
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
                  <h6 className="mb-0" style={{fontSize: '0.9rem'}}>{patientName}</h6>
                  <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>
                    Psikolog: {psikologName}
                  </small>
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold" style={{fontSize: '0.85rem'}}>
                  {new Date(appointment.appointmentDate).toLocaleDateString('sq-AL', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <small className="text-muted" style={{fontSize: '0.75rem'}}>
                  {new Date(appointment.appointmentDate).toLocaleTimeString('sq-AL', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </small>
                <br />
                <small className={`badge ${appointment.status === 'Completed' || appointment.status === 'completed' ? 'bg-success' : 
                  appointment.status === 'Cancelled' || appointment.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`} style={{fontSize: '0.7rem'}}>
                  {appointment.status === 'Completed' || appointment.status === 'completed' ? 'Përfunduar' : 
                   appointment.status === 'Cancelled' || appointment.status === 'cancelled' ? 'Anuluar' : 'Në pritje'}
                </small>
              </div>
            </div>
          );
        })
      ) : (
        <div className="list-group-item text-center text-muted py-4" style={{fontSize: '0.9rem'}}>
          Nuk ka takime të fundit
        </div>
      )}
    </div>
  );
}

// Komponenti për veprimet e shpejta (i përditësuar)
function QuickActions() {
  const actions = [
    { title: "Shto Psikolog", icon: "👨‍⚕️", link: "/add-psikologin", color: "primary", desc: "Regjistro psikolog të ri" },
    { title: "Shto Pacient", icon: "👤", link: "/add-pacientin", color: "success", desc: "Regjistro pacient të ri" },
    { title: "Menaxho Takimet", icon: "📅", link: "/menaxhoTakimetAdmin", color: "info", desc: "Shiko dhe menaxho takimet" },
    {title: "Menaxho Njoftimet", icon:"🔔", link:"/admin-notifications",color: "primary", desc:"Shiko dhe menaxho njoftimet"},
    {title: "Gjenero raporte", icon:"📋", link:"/raportet-admin",color: "primary", desc:"Shiko dhe gjenero raporte"},
  ];

  return (
    <div className="d-flex flex-column gap-2">
      {actions.map((action, index) => (
        <Link 
          to={action.link} 
          className={`btn btn-outline-${action.color} text-start py-2 px-3`}
          key={index}
          style={{fontSize: '0.85rem'}}
        >
          <div className="d-flex align-items-center">
            <div className="me-2" style={{fontSize: '1.2rem'}}>{action.icon}</div>
            <div className="flex-grow-1">
              <div className="fw-semibold">{action.title}</div>
              <small className="text-muted" style={{fontSize: '0.75rem'}}>{action.desc}</small>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default AdminDashboard;