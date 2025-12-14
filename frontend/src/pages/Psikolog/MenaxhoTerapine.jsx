import React, { useEffect, useState } from "react";
import { getAllTherapySessions, deleteTherapySession } from "../../services/TherapySessionService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function MenaxhoTerapine() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Të gjitha");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllTherapySessions();
      console.log("🧠 Therapy sessions:", res.data);
      setSessions(res.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së seancave:", error);
      toast.error("Gabim gjatë marrjes së seancave");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë seancë?")) {
      try {
        await deleteTherapySession(id);
        toast.success("Seanca u fshi me sukses!");
        fetchData();
      } catch (error) {
        toast.error("Gabim gjatë fshirjes së seancës!");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSessions = sessions.filter(session => {
    if (filterStatus === "Të gjitha") return true;
    return session.status === filterStatus;
  });

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === "Scheduled").length,
    completed: sessions.filter(s => s.status === "Completed").length,
    cancelled: sessions.filter(s => s.status === "Cancelled").length,
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Scheduled': { class: 'bg-warning text-dark', label: 'I planifikuar' },
      'Completed': { class: 'bg-success', label: 'I përfunduar' },
      'Cancelled': { class: 'bg-danger', label: 'I anuluar' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', label: status };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getSessionTypeBadge = (type) => {
    const typeConfig = {
      'Individual': { class: 'bg-primary', label: 'Individuale' },
      'Group': { class: 'bg-info', label: 'Grupore' },
      'Family': { class: 'bg-success', label: 'Familjare' }
    };
    
    const config = typeConfig[type] || { class: 'bg-secondary', label: type };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "250px", position: "fixed", height: "100vh" }}
      >
        {/* Dashboard */}
        <div className="mb-3">
          <Link to="/psikologDashboard" className="nav-link text-white px-3 py-2 mb-1" style={{borderRadius: '4px'}}>
            🏠 Dashboard
          </Link>
        </div>

        {/* Terapia Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>🧘 Terapia</small>
          </div>
          <Link to="/menaxhoTerapine" className="nav-link text-white px-3 py-2 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px'}}>
            📋 Menaxho Seanca
          </Link>
          <Link to="/add-terapine" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto Seancë
          </Link>
        </div>
        
        <div className="mt-auto">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={() => navigate('/psikologDashboard')} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Menaxho Seancat e Terapisë</h2>
            <Link to="/add-terapine" className="btn btn-primary">
              ➕ Shto Seancë të Re
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card border-primary shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted mb-2">Totali</h6>
                  <h3 className="mb-0 text-primary fw-bold">{stats.total}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-warning shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted mb-2">Të planifikuara</h6>
                  <h3 className="mb-0 text-warning fw-bold">{stats.scheduled}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-success shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted mb-2">Të përfunduara</h6>
                  <h3 className="mb-0 text-success fw-bold">{stats.completed}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-danger shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted mb-2">Të anuluara</h6>
                  <h3 className="mb-0 text-danger fw-bold">{stats.cancelled}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                {["Të gjitha", "Scheduled", "Completed", "Cancelled"].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-outline-primary'}`}
                  >
                    {status === "Të gjitha" ? "Të gjitha" : 
                     status === "Scheduled" ? "Të planifikuara" :
                     status === "Completed" ? "Të përfunduara" : "Të anuluara"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Duke ngarkuar...</span>
                  </div>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">Nuk ka seanca për të shfaqur</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Nr.</th>
                        <th>Pacienti</th>
                        <th>Data</th>
                        <th>Kohëzgjatja</th>
                        <th>Mood</th>
                        <th>Shënime</th>
                        <th>Statusi</th>
                        <th className="text-end">Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.map((session) => (
                        <tr key={session.id}>
                          <td>
                            <span className="badge bg-info"># {session.sessionNumber}</span>
                          </td>
                          <td>
                            <div className="fw-bold">{session.patientName}</div>
                          </td>
                          <td>
                            <div>{new Date(session.sessionDate).toLocaleDateString('sq-AL')}</div>
                            <small className="text-muted">
                              {new Date(session.sessionDate).toLocaleTimeString('sq-AL', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </small>
                          </td>
                          <td>{session.durationMinutes} min</td>
                          <td>
                            <small className="text-muted">
                              {session.moodBefore || 'N/A'}
                              {session.moodAfter && (
                                <><br />→ {session.moodAfter}</>
                              )}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {session.notes ? (session.notes.length > 40 ? `${session.notes.substring(0, 40)}...` : session.notes) : 'N/A'}
                            </small>
                          </td>
                          <td>{getStatusBadge(session.status)}</td>
                          <td className="text-end">
                            <div className="btn-group">
                              <Link 
                                to={`/edit-terapine/${session.id}`} 
                                className="btn btn-sm btn-outline-primary"
                              >
                                ✏️ Modifiko
                              </Link>
                              <button 
                                onClick={() => handleDelete(session.id)} 
                                className="btn btn-sm btn-outline-danger"
                              >
                                🗑️ Fshi
                              </button>
                            </div>
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
      </div>
    </div>
  );
}

export default MenaxhoTerapine;
