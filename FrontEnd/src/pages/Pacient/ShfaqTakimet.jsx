import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyTakimet } from "../../services/AppointmentService";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function ShfaqTakimet() {
  const navigate = useNavigate();
  const [takimet, setTakimet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Të gjitha");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/pacientDashboard");
  };

  useEffect(() => {
    fetchTakimet();
  }, []);

  const fetchTakimet = async () => {
    try {
      setLoading(true);
      const response = await getMyTakimet();
      console.log("📅 Takimet e mia:", response.data);
      setTakimet(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së takimeve:", error);
      toast.error("Gabim gjatë marrjes së takimeve");
    } finally {
      setLoading(false);
    }
  };

  // Filtro takimet sipas statusit
  const filteredTakimet = takimet.filter(takim => {
    if (filterStatus === "Të gjitha") return true;
    return takim.status === filterStatus;
  });

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
        <h4 className="mb-4 text-center">Pacient Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/pacientDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaqRaportet" className="nav-link text-white">
              📊 Raportet e Mia
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaqTakimet" className="nav-link text-white active">
              📅 Takimet e Mia
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaqTerapine" className="nav-link text-white">
              🧘 Terapitë e Mija
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaqPsikologet" className="nav-link text-white">
              👨‍⚕️ Psikologët
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={handleBack} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Takimet e Mia</h2>
            <div className="text-muted">
              {new Date().toLocaleDateString('sq-AL')}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Duke ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar takimet...</p>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h5 className="mb-0">
                      <i className="fas fa-calendar-alt me-2"></i>
                      Lista e Takimeve ({filteredTakimet.length})
                    </h5>
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
                {filteredTakimet.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Nuk keni takime</h5>
                    <p className="text-muted">Takimet tuaja do të shfaqen këtu.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Psikologu</th>
                          <th>Data dhe Koha</th>
                          <th>Shënime</th>
                          <th>Statusi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTakimet.map((t) => (
                          <tr key={t.id}>
                            <td>
                              <div>
                                <strong>{t.psikologName}</strong>
                                <br />
                                <small className="text-muted">ID: {t.psikologId}</small>
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
                              {getStatusBadge(t.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShfaqTakimet;