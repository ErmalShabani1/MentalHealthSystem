import React, { useEffect, useState } from "react";
import { getTakimetByPsikologId, deleteTakimin } from "../../services/AppointmentService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function MenaxhoTakimet() {
  const navigate = useNavigate();
  const [takimet, setTakimet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Të gjitha");
  const psikologId = localStorage.getItem("psikologId");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  // Merr takimet nga backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getTakimetByPsikologId(psikologId);
      console.log("🧠 API response:", res.data);
      setTakimet(res.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së takimeve:", error);
      toast.error("Gabim gjatë marrjes së takimeve");
    } finally {
      setLoading(false);
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

  const handleStatusChange = async (takimId, newStatus) => {
    try {
      // Këtu duhet të implementosh update të statusit
      // Për momentin, vetëm përditësojmë lokalisht
      setTakimet(prev => prev.map(t => 
        t.id === takimId ? { ...t, status: newStatus } : t
      ));
      toast.success(`Statusi u ndryshua në ${newStatus}`);
    } catch (error) {
      toast.error("Gabim gjatë ndryshimit të statusit!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtro takimet sipas statusit
  const filteredTakimet = takimet.filter(takim => {
    if (filterStatus === "Të gjitha") return true;
    return takim.status === filterStatus;
  });

  // Llogarit statistikat
  const stats = {
    total: takimet.length,
    scheduled: takimet.filter(t => t.status === "Scheduled").length,
    completed: takimet.filter(t => t.status === "Completed").length,
    cancelled: takimet.filter(t => t.status === "Cancelled").length,
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

        {/* Takimet Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>📅 Takimet</small>
          </div>
          <Link to="/menaxhoTakimet" className="nav-link text-white px-3 py-2 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px'}}>
            📋 Menaxho Takimet
          </Link>
          <Link to="/add-takimet" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto Takim
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

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          {/* Header dhe Statistikat */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Menaxho Takimet</h2>
              <p className="text-muted mb-0">Menaxho të gjitha takimet e tua</p>
            </div>
            <Link to="/add-takimet" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Takim i Ri
            </Link>
          </div>

          {/* Statistikat e shpejta */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{stats.total}</h4>
                      <small>Total Takime</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-calendar-alt fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{stats.scheduled}</h4>
                      <small>Në Pritje</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-clock fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{stats.completed}</h4>
                      <small>Përfunduar</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-check-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-danger text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{stats.cancelled}</h4>
                      <small>Anuluar</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-times-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtri dhe Tabela */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Lista e Takimeve</h5>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-end">
                    <select 
                      className="form-select w-auto"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="Të gjitha">Të gjitha takimet</option>
                      <option value="Scheduled">I planifikuar</option>
                      <option value="Completed">I përfunduar</option>
                      <option value="Cancelled">I anuluar</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Duke ngarkuar...</span>
                  </div>
                  <p className="mt-2">Duke ngarkuar takimet...</p>
                </div>
              ) : filteredTakimet.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Nuk ka takime</h5>
                  <p className="text-muted">Shtoni takimin tuaj të parë duke klikuar butonin "Takim i Ri"</p>
                  <Link to="/add-takimet" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Shto Takim të Ri
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Pacienti</th>
                        <th>Data dhe Koha</th>
                        <th>Statusi</th>
                        <th>Shënime</th>
                        <th className="text-center" width="200">Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTakimet.map((t) => (
                        <tr key={t.id}>
                          <td>
                            <div>
                              <div className="fw-bold">{t.patientName}</div>
                              <small className="text-muted">ID: {t.patientId}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{new Date(t.appointmentDate).toLocaleDateString('sq-AL')}</div>
                              <small className="text-muted">
                                {new Date(t.appointmentDate).toLocaleTimeString('sq-AL', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </small>
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(t.status)}
                          </td>
                          <td>
                            {t.notes ? (
                              <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}} title={t.notes}>
                                {t.notes}
                              </span>
                            ) : (
                              <span className="text-muted fst-italic">Pa shënime</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/edit-takimet/${t.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="fas fa-edit me-1"></i>
                                Modifiko
                              </Link>
                              
                              <button
                                onClick={() => handleDelete(t.id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                <i className="fas fa-trash me-1"></i>
                                Fshi
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

          {/* Informacion shtesë */}
          <div className="mt-3">
            <small className="text-muted">
              Duke shfaqur {filteredTakimet.length} nga {takimet.length} takime totale
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenaxhoTakimet;