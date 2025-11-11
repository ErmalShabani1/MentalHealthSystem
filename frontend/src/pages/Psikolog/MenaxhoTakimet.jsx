import React, { useEffect, useState } from "react";
import { getTakimetByPsikologId, deleteTakimin } from "../../services/AppointmentService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MenaxhoTakimet() {
  const [takimet, setTakimet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Të gjitha");
  const psikologId = localStorage.getItem("psikologId");

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

<<<<<<< HEAD
  useEffect(() => {
    // Merr të gjithë pacientët nga backend
    const fetchPatients = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5054/api/Patient/get-all",
          { withCredentials: true }
        );
        setPatients(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së pacientëve:", error);
      }
    };
=======
  // Filtro takimet sipas statusit
  const filteredTakimet = takimet.filter(takim => {
    if (filterStatus === "Të gjitha") return true;
    return takim.status === filterStatus;
  });
>>>>>>> f5d97ba (Stilizime ne front end)

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
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh", overflowY: "auto" }}
      >
        <h4 className="mb-4 text-center">Psikolog Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/psikologDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/add-takimet" className="nav-link text-white">
              ➕ Shto Takim
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoTakimet" className="nav-link text-white active">
              📋 Menaxho Takimet
            </Link>
          </li>
          <li className="nav-item mb-2">
<<<<<<< HEAD
            <Link to="/raportet" className="nav-link text-white">
              📊 Raportet e Pacientëve
=======
            <Link to="/pacientetEMi" className="nav-link text-white">
              👥 Pacientët e Mi
>>>>>>> f5d97ba (Stilizime ne front end)
            </Link>
          </li>
        </ul>
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
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Pacienti</th>
                        <th>Data dhe Koha</th>
                        <th>Statusi</th>
                        <th>Shënime</th>
                        <th width="150">Veprimet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTakimet.map((t) => (
                        <tr key={t.id}>
                          <td>
                            <div>
                              <strong>{t.patientName}</strong>
                              <br />
                              <small className="text-muted">ID: {t.patientId}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{new Date(t.appointmentDate).toLocaleDateString('sq-AL')}</strong>
                              <br />
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
                              <span title={t.notes}>
                                {t.notes.length > 50 
                                  ? `${t.notes.substring(0, 50)}...` 
                                  : t.notes
                                }
                              </span>
                            ) : (
                              <span className="text-muted">Nuk ka shënime</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <Link
                                to={`/edit-takimet/${t.id}`}
                                className="btn btn-outline-warning"
                                title="Modifiko takimin"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              
                              <select 
                                className="form-select form-select-sm"
                                value={t.status}
                                onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                title="Ndrysho statusin"
                              >
                                <option value="Scheduled">Planifikuar</option>
                                <option value="Completed">Përfunduar</option>
                                <option value="Cancelled">Anuluar</option>
                              </select>
                              
                              <button
                                onClick={() => handleDelete(t.id)}
                                className="btn btn-outline-danger"
                                title="Fshi takimin"
                              >
                                <i className="fas fa-trash"></i>
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