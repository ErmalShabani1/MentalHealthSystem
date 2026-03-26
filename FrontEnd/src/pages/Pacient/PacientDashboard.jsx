import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRaportet } from "../../services/RaportService";
import { getMyTakimet } from "../../services/AppointmentService";
import { getUnreadCount } from "../../services/NotificationService";
import { toast } from "react-toastify";
import PatientNewsSection from "../Pacient/PatientNewsSection";
import PatientSidePanel from "./PatientSidePanel";

function PacientDashboard() {
  const [raportet, setRaportet] = useState([]);
  const [takimet, setTakimet] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Merr emrin e pacientit nga localStorage
        const storedName = localStorage.getItem("userName") || localStorage.getItem("patientName") || "Pacient";
        setPatientName(storedName);
        
        // Merr të dhënat e pacientit
        const [raportetRes, takimetRes, unreadCountRes] = await Promise.all([
          getMyRaportet().catch(err => { 
            console.log("Raportet nuk u morën:", err); 
            return { data: [] }; 
          }),
          getMyTakimet().catch(err => { 
            console.log("Takimet nuk u morën:", err); 
            return { data: [] }; 
          }),
          getUnreadCount().catch(err => {
            console.log("Unread count nuk u mor:", err);
            return 0;
          })
        ]);

        setRaportet(raportetRes.data || []);
        setTakimet(takimetRes.data || []);
        setUnreadCount(unreadCountRes || 0);
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
  const completedAppointments = takimet.filter(t => 
    t.status === "Completed" || t.status === "completed"
  ).length;
  
  const upcomingAppointments = takimet.filter(t => 
    new Date(t.appointmentDate) > new Date() && (t.status === "Scheduled" || t.status === "scheduled")
  ).length;
  
  const todayAppointments = takimet.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.appointmentDate).toDateString() === today;
  }).length;

  const totalRaporte = raportet.length;
  const totalTakime = takimet.length;
  
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

  // Të dhëna për grafikët
  const statsData = [
    { label: 'Takime', value: totalTakime, color: '#3b82f6', icon: '📅' },
    { label: 'Raporte', value: totalRaporte, color: '#10b981', icon: '📋' },
    { label: 'Aktive', value: upcomingAppointments, color: '#f59e0b', icon: '⏰' },
    { label: 'Përfunduar', value: completedAppointments, color: '#8b5cf6', icon: '✅' },
  ];

  const activityData = [
    { label: 'Sot', value: todayAppointments, color: '#3b82f6' },
    { label: 'Në Pritje', value: upcomingAppointments, color: '#f59e0b' },
    { label: 'Përfunduar', value: completedAppointments, color: '#10b981' },
  ];

  // Funksion për të llogaritur përqindjen
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <PatientSidePanel
        section="dashboard"
        activePath="/pacientDashboard"
        linkBadges={{ "/my-notifications": unreadCount }}
      />

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "240px", backgroundColor: "#f8f9fa", overflowY: "auto", height: "100vh" }}>
        <div className="container-fluid py-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0 fw-bold">Mirë se vini, {patientName}!</h4>
              <p className="text-muted mb-0" style={{fontSize: '0.9rem'}}>Dashboard i Pacientit</p>
            </div>
            <div className="text-muted text-end" style={{fontSize: '0.9rem'}}>
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
                            <div className="small text-muted" style={{fontSize: '0.75rem'}}>Total</div>
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

              {/* Njoftimet */}
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <div className={`card ${unreadCount > 0 ? 'border-warning' : 'border-primary'}`}>
                    <div className={`card-header ${unreadCount > 0 ? 'bg-warning bg-opacity-10' : 'bg-primary bg-opacity-10'} py-2 d-flex justify-content-between align-items-center`}>
                      <h6 className="mb-0">
                        {unreadCount > 0 && <span className="badge bg-danger me-2">{unreadCount}</span>}
                        🔔 Njoftimet e Mia
                      </h6>
                      <Link to="/my-notifications" className={`btn btn-sm ${unreadCount > 0 ? 'btn-warning' : 'btn-primary'}`}>
                        📬 Shiko njoftimet
                      </Link>
                    </div>
                    <div className="card-body py-3">
                      {unreadCount > 0 ? (
                        <div className="alert alert-warning mb-0 d-flex align-items-center">
                          <span className="me-2" style={{fontSize: '1.5rem'}}>🔔</span>
                          <span>Keni <strong>{unreadCount}</strong> njoftim{unreadCount > 1 ? 'e' : ''} të palexuar nga psikologu juaj. Klikoni "Shiko njoftimet" për t'i lexuar.</span>
                        </div>
                      ) : (
                        <div className="alert alert-info mb-0 d-flex align-items-center">
                          <span className="me-2" style={{fontSize: '1.5rem'}}>✅</span>
                          <span>Nuk keni njoftime të reja. Të gjitha njoftimet janë të lexuara.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grafikët e thjeshtë */}
              <div className="row g-3 mb-4">
                <div className="col-lg-4">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Aktiviteti i Takimeve</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-column gap-2">
                        {activityData.map((item, index) => {
                          const total = activityData.reduce((sum, s) => sum + s.value, 0);
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
                      <h6 className="mb-0">Përparimi Yt</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-around align-items-end" style={{height: '150px'}}>
                        <div className="text-center">
                          <div style={{height: `${(todayAppointments/5)*100}px`, backgroundColor: '#3b82f6', width: '30px', borderRadius: '4px'}}></div>
                          <div className="mt-1 small">Sot</div>
                          <div className="fw-bold">{todayAppointments}</div>
                        </div>
                        <div className="text-center">
                          <div style={{height: `${(upcomingAppointments/10)*100}px`, backgroundColor: '#f59e0b', width: '30px', borderRadius: '4px'}}></div>
                          <div className="mt-1 small">Në Pritje</div>
                          <div className="fw-bold">{upcomingAppointments}</div>
                        </div>
                        <div className="text-center">
                          <div style={{height: `${(completedAppointments/20)*100}px`, backgroundColor: '#10b981', width: '30px', borderRadius: '4px'}}></div>
                          <div className="mt-1 small">Përfunduar</div>
                          <div className="fw-bold">{completedAppointments}</div>
                        </div>
                        <div className="text-center">
                          <div style={{height: `${(raportetThisMonth/10)*100}px`, backgroundColor: '#8b5cf6', width: '30px', borderRadius: '4px'}}></div>
                          <div className="mt-1 small">Raporte</div>
                          <div className="fw-bold">{raportetThisMonth}</div>
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
                                #3b82f6 ${(todayAppointments/(todayAppointments+upcomingAppointments+completedAppointments+totalRaporte))*100}%,
                                #f59e0b ${(todayAppointments/(todayAppointments+upcomingAppointments+completedAppointments+totalRaporte))*100}% ${((todayAppointments+upcomingAppointments)/(todayAppointments+upcomingAppointments+completedAppointments+totalRaporte))*100}%,
                                #10b981 ${((todayAppointments+upcomingAppointments)/(todayAppointments+upcomingAppointments+completedAppointments+totalRaporte))*100}% ${((todayAppointments+upcomingAppointments+completedAppointments)/(todayAppointments+upcomingAppointments+completedAppointments+totalRaporte))*100}%,
                                #8b5cf6 ${((todayAppointments+upcomingAppointments+completedAppointments)/(todayAppointments+upcomingAppointments+completedAppointments+totalRaporte))*100}% 100%
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
                            <span>Takime Sot: {todayAppointments}</span>
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <div style={{width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '2px', marginRight: '5px'}}></div>
                            <span>Në Pritje: {upcomingAppointments}</span>
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <div style={{width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '2px', marginRight: '5px'}}></div>
                            <span>Përfunduar: {completedAppointments}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <div style={{width: '10px', height: '10px', backgroundColor: '#8b5cf6', borderRadius: '2px', marginRight: '5px'}}></div>
                            <span>Raporte: {totalRaporte}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raportet e fundit dhe Lajmet */}
              <div className="row g-3 mb-4">
                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Raportet e Fundit</h6>
                      <Link to="/shfaqRaportet" className="btn btn-sm btn-primary">
                        👁️ Shiko të gjitha
                      </Link>
                    </div>
                    <div className="card-body p-0" style={{maxHeight: '250px', overflowY: 'auto'}}>
                      <RaportetList raportet={raportet.slice(0, 5)} />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Lajmet & Këshillat</h6>
                      <Link to="/newsList" className="btn btn-sm btn-success">
                        📖 Lexo më shumë
                      </Link>
                    </div>
                    <div className="card-body p-0" style={{maxHeight: '250px', overflowY: 'auto'}}>
                      <PatientNewsSection />
                    </div>
                  </div>
                </div>
              </div>

              {/* Takimet e ardhshme dhe Aktivitete */}
              <div className="row g-3">
                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Takimet e Ardhshme</h6>
                      <Link to="/shfaqTakimet" className="btn btn-sm btn-warning">
                        📅 Shiko të gjitha
                      </Link>
                    </div>
                    <div className="card-body p-0" style={{maxHeight: '250px', overflowY: 'auto'}}>
                      <TakimetList takimet={takimet.filter(t => 
                        new Date(t.appointmentDate) > new Date() && (t.status === "Scheduled" || t.status === "scheduled")
                      ).slice(0, 5)} />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Aktivitete të Shpejta</h6>
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
                      <h6 className="mb-0">Progresi Ynë</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{fontSize: '0.85rem'}}>Ushtrime të përfunduara</span>
                        <span className="badge bg-primary">0</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{fontSize: '0.85rem'}}>Seanca terapi</span>
                        <span className="badge bg-success">0</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{fontSize: '0.85rem'}}>Planet e trajtimit</span>
                        <span className="badge bg-info">0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header py-2">
                      <h6 className="mb-0">Statistikat Muajore</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{fontSize: '0.85rem'}}>Takime të reja</span>
                        <span className="badge bg-warning">{todayAppointments}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{fontSize: '0.85rem'}}>Raporte të rinj</span>
                        <span className="badge bg-success">{raportetThisMonth}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{fontSize: '0.85rem'}}>Dita pa stres</span>
                        <span className="badge bg-info">
                          {Math.floor(Math.random() * 10) + 1}
                        </span>
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

// Komponenti për listën e raporteve (i përditësuar)
function RaportetList({ raportet }) {
  return (
    <div className="list-group list-group-flush">
      {raportet.length > 0 ? (
        raportet.slice(0, 5).map((rap, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
            <div className="d-flex align-items-center">
              <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '35px', height: '35px'}}>
                <span style={{fontSize: '1rem'}}>📋</span>
              </div>
              <div>
                <h6 className="mb-0" style={{fontSize: '0.9rem'}}>
                  {rap.title || 'Raport pa titull'}
                </h6>
                <div className="d-flex justify-content-between" style={{fontSize: '0.75rem'}}>
                  <span className="text-muted">
                    {new Date(rap.createdAt || rap.date).toLocaleDateString('sq-AL')}
                  </span>
                  <span className="badge bg-info" style={{fontSize: '0.7rem'}}>
                    {(rap.diagnoza || 'Pa diagnozë').substring(0, 15)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4" style={{fontSize: '0.9rem'}}>
          <span style={{fontSize: '1.5rem'}} className="d-block mb-2">📋</span>
          <p className="mb-0">Nuk keni raporte</p>
        </div>
      )}
    </div>
  );
}

// Komponenti për listën e takimeve (i përditësuar)
function TakimetList({ takimet }) {
  return (
    <div className="list-group list-group-flush">
      {takimet.length > 0 ? (
        takimet.slice(0, 5).map((takim, index) => (
          <div key={index} className="list-group-item py-2 px-3 border-bottom">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                  <span style={{fontSize: '1rem'}}>
                    {new Date(takim.appointmentDate).getDate()}
                  </span>
                </div>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0" style={{fontSize: '0.9rem'}}>
                  {takim.psikologName || "Psikologu im"}
                </h6>
                <div className="d-flex justify-content-between" style={{fontSize: '0.75rem'}}>
                  <span className="text-muted">
                    {new Date(takim.appointmentDate).toLocaleDateString('sq-AL', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-primary fw-semibold">
                    {new Date(takim.appointmentDate).toLocaleTimeString('sq-AL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
              <div className="ms-2">
                <span className="badge bg-warning" style={{fontSize: '0.7rem'}}>
                  {takim.status === 'Scheduled' || takim.status === 'scheduled' ? 'Planifikuar' : takim.status}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="list-group-item text-center text-muted py-4" style={{fontSize: '0.9rem'}}>
          <span style={{fontSize: '1.5rem'}} className="d-block mb-2">📅</span>
          <p className="mb-0">Nuk keni takime të ardhshme</p>
        </div>
      )}
    </div>
  );
}

// Komponenti për veprimet e shpejta
function QuickActions() {
  const actions = [
    { title: "Rezervo Takim", icon: "📅", link: "/book-appointment", color: "primary", desc: "Bëj një takim të ri" },
    { title: "Shiko Raportet", icon: "📋", link: "/shfaqRaportet", color: "success", desc: "Kontrollo raportet" },
    { title: "Lexo Lajmet", icon: "📰", link: "/newsList", color: "info", desc: "Informohu me këshilla" },
    { title: "Ushtrimet e Mia", icon: "💪", link: "/shfaq-ushtrimet", color: "warning", desc: "Vazhdo ushtrimet" },
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

export default PacientDashboard;