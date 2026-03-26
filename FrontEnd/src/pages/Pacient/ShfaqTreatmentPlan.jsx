import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyTreatmentPlans } from "../../services/TreatmentPlanService";
import { logoutUser } from "../../services/authService";

function ShfaqTreatmentPlan() {
  const navigate = useNavigate();
  const [treatmentPlans, setTreatmentPlans] = useState([]);
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
    fetchTreatmentPlans();
  }, []);

  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      const response = await getMyTreatmentPlans();
      console.log("📋 Treatment Plan-et e mia:", response.data);
      setTreatmentPlans(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së treatment plan-eve:", error);
      toast.error("Gabim gjatë marrjes së treatment plan-eve");
    } finally {
      setLoading(false);
    }
  };

  // Filtro treatment plan-et sipas statusit
  const filteredPlans = treatmentPlans.filter(plan => {
    if (filterStatus === "Të gjitha") return true;
    return plan.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'OnHold': { class: 'bg-secondary', label: 'Në Pritje' },
      'Active': { class: 'bg-success', label: 'Aktiv' },
      'Completed': { class: 'bg-primary', label: 'I Përfunduar' },
      'Cancelled': { class: 'bg-danger', label: 'I Anuluar' }
    };
    
    const config = statusConfig[status] || { class: 'bg-warning text-dark', label: status };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('sq-AL');
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar - Pacient Dashboard */}
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
            <Link to="/shfaqTakimet" className="nav-link text-white">
              📅 Takimet e Mia
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaqTerapine" className="nav-link text-white">
              🧘 Terapitë e Mija
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/shfaq-treatmentplan" className="nav-link text-white active">
              📋 Planet e Mia të Trajtimit
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
            <h2 className="mb-0">Planet e Mia të Trajtimit</h2>
            <div className="text-muted">
              {new Date().toLocaleDateString('sq-AL')}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Duke ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar planet e trajtimit...</p>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h5 className="mb-0">
                      <i className="fas fa-clipboard-list me-2"></i>
                      Lista e Planetve të Trajtimit ({filteredPlans.length})
                    </h5>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-end">
                      <select 
                        className="form-select w-auto"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="Të gjitha">Të gjitha planet</option>
                        <option value="OnHold">Në Pritje</option>
                        <option value="Active">Aktivë</option>
                        <option value="Completed">Të Përfunduar</option>
                        <option value="Cancelled">Të Anuluar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-body p-0">
                {filteredPlans.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Nuk keni treatment plan-e</h5>
                    <p className="text-muted">Planet tuaja të trajtimit do të shfaqen këtu.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Titulli</th>
                          <th>Psikologu</th>
                          <th>Data e Fillimit</th>
                          <th>Data e Mbarimit</th>
                          <th>Statusi</th>
                          <th>Qëllimet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlans.map((plan) => (
                          <tr key={plan.treatmentPlanId}>
                            <td>
                              <div>
                                <strong className="text-primary">{plan.title}</strong>
                                {plan.description && (
                                  <br />
                                )}
                                {plan.description && (
                                  <small className="text-muted" title={plan.description}>
                                    {plan.description.length > 30 
                                      ? `${plan.description.substring(0, 30)}...` 
                                      : plan.description
                                    }
                                  </small>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>ID: {plan.psikologId}</strong>
                                <br />
                                <small className="text-muted">Psikolog</small>
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold">
                                {formatDate(plan.startDate)}
                              </div>
                            </td>
                            <td>
                              <div className={plan.endDate ? "fw-semibold" : "text-muted fst-italic"}>
                                {formatDate(plan.endDate) || 'Nuk ka'}
                              </div>
                            </td>
                            <td>
                              {getStatusBadge(plan.status)}
                            </td>
                            <td>
                              {plan.goals ? (
                                <span title={plan.goals}>
                                  {plan.goals.length > 40 
                                    ? `${plan.goals.substring(0, 40)}...` 
                                    : plan.goals
                                  }
                                </span>
                              ) : (
                                <span className="text-muted">Nuk ka qëllime</span>
                              )}
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

export default ShfaqTreatmentPlan;