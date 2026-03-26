import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getTreatmentPlansForPsikolog, deleteTreatmentPlan } from "../../services/TreatmentPlanService";
import PsikologSidePanel from "./PsikologSidePanel";

function MenaxhoTreatmentPlan() {
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Të gjitha");

  // Merr treatment plan-et nga backend
  const fetchData = async () => {
    try {
      setLoading(true);
     const response = await getTreatmentPlansForPsikolog();
      console.log("📋 Treatment Plan-et e marra:", response.data);
      setTreatmentPlans(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së treatment plan-eve:", error);
      toast.error("Gabim gjatë marrjes së treatment plan-eve");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë treatment plan?")) {
      try {
       await deleteTreatmentPlan(id);
        toast.success("Treatment Plan u fshi me sukses!");
        fetchData();
      } catch (error) {
        toast.error("Gabim gjatë fshirjes së treatment plan!");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtro treatment plan-et sipas statusit
  const filteredPlans = treatmentPlans.filter(plan => {
    if (filterStatus === "Të gjitha") return true;
    return plan.status === filterStatus;
  });

  // Llogarit statistikat
  const stats = {
    total: treatmentPlans.length,
    onHold: treatmentPlans.filter(p => p.status === "OnHold").length,
    active: treatmentPlans.filter(p => p.status === "Active").length,
    completed: treatmentPlans.filter(p => p.status === "Completed").length,
  };

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
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <PsikologSidePanel section="treatmentPlan" activePath="/menaxho-treatmentplan" />

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          {/* Header dhe Statistikat */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Menaxho Treatment Planet</h2>
              <p className="text-muted mb-0">Menaxho të gjitha treatment plan-et e tua</p>
            </div>
            <Link to="/add-treatmentplan" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Plan i Ri
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
                      <small>Total Planet</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-clipboard-list fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-secondary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{stats.onHold}</h4>
                      <small>Në Pritje</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-pause-circle fa-2x opacity-50"></i>
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
                      <h4 className="mb-0">{stats.active}</h4>
                      <small>Aktivë</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-play-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-info text-white">
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
          </div>

          {/* Filtri dhe Tabela */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Lista e Treatment Plan-eve</h5>
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
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Duke ngarkuar...</span>
                  </div>
                  <p className="mt-2">Duke ngarkuar treatment plan-et...</p>
                </div>
              ) : filteredPlans.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Nuk ka treatment plan-e</h5>
                  <p className="text-muted">Shtoni treatment plan-in tuaj të parë duke klikuar butonin "Plan i Ri"</p>
                  <Link to="/add-treatmentplan" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Shto Plan të Ri
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Titulli</th>
                        <th>Pacienti</th>
                        <th>Data e Fillimit</th>
                        <th>Data e Mbarimit</th>
                        <th>Statusi</th>
                        <th className="text-center" width="200">Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlans.map((plan) => (
                        <tr key={plan.treatmentPlanId}>
                          <td>
                            <div>
                              <div className="fw-bold text-primary">{plan.title}</div>
                              {plan.description && (
                                <small className="text-muted d-block" title={plan.description}>
                                  {plan.description.length > 50 
                                    ? `${plan.description.substring(0, 50)}...` 
                                    : plan.description
                                  }
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">ID: {plan.patientId}</div>
                              <small className="text-muted">Pacient</small>
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
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/edit-treatmentplan/${plan.treatmentPlanId}`}
                                className="btn btn-sm btn-outline-warning"
                              >
                                <i className="fas fa-edit me-1"></i>
                                Modifiko
                              </Link>
                              
                              <button
                                onClick={() => handleDelete(plan.treatmentPlanId)}
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
              Duke shfaqur {filteredPlans.length} nga {treatmentPlans.length} treatment plan-e totale
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenaxhoTreatmentPlan;