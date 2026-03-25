import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllRaportet, deleteRaportin, getRaportetByPsikologId } from "../../services/RaportService";
import { logoutUser } from "../../services/authService";

function MenaxhoRaportet() {
  const navigate = useNavigate();
  const [raportet, setRaportet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPatient, setFilterPatient] = useState("Të gjitha");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    fetchRaportet();
  }, []);

  // Merr raportet nga backend
 const fetchRaportet = async () => {
  try {
    setLoading(true);
    const response = await getAllRaportet();
    
    console.log("🔍 Të gjitha raportet nga API:", response.data);
    
    // Shfaq properties e objektit të parë
    if (response.data.length > 0) {
      const firstReport = response.data[0];
      console.log("📋 Properties të raportit të parë:", Object.keys(firstReport));
      console.log("🆔 ID:", firstReport.id);
      console.log("👤 PsikologId:", firstReport.psikologId);
      console.log("👥 PatientId:", firstReport.patientId);
      console.log("📝 Titulli:", firstReport.title);
    }
    
    // Përdor të gjitha raportet për momentin (pa filter)
    setRaportet(response.data);
  } catch (error) {
    console.error("Gabim gjatë marrjes së raporteve:", error);
    toast.error("Gabim gjatë marrjes së raporteve");
  } finally {
    setLoading(false);
  }
};

// Në handleDelete:
const handleDelete = async (id) => {
  if (window.confirm("A jeni i sigurt që doni ta fshini këtë raport?")) {
    try {
      await deleteRaportin(id);
      toast.success("Raporti u fshi me sukses!");
      fetchRaportet();
    } catch (error) {
      toast.error("Gabim gjatë fshirjes së raportit!");
    }
  }
};

  // Filtro raportet sipas pacientit
  const filteredRaportet = raportet.filter(raport => {
    if (filterPatient === "Të gjitha") return true;
    return raport.patientName === filterPatient;
  });

  // Merr pacientët unikë për filter
  const uniquePatients = [...new Set(raportet.map(r => r.patientName))];

  // Llogarit statistikat
  const stats = {
    total: raportet.length,
    patients: uniquePatients.length,
    thisMonth: raportet.filter(r => {
      const reportDate = new Date(r.createdAt);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && 
             reportDate.getFullYear() === now.getFullYear();
    }).length,
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

        {/* Pacientët Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>📖 Pacientët</small>
          </div>
          <Link to="/menaxhoRaportet" className="nav-link text-white px-3 py-2 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px'}}>
            👨‍⚕️ Menaxho Raportet
          </Link>
          <Link to="/add-raportin" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto Raport
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
              <h2 className="mb-1">Menaxho Raportet</h2>
              <p className="text-muted mb-0">Menaxho të gjitha raportet e pacientëve</p>
            </div>
            <Link to="/add-raportin" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Raport i Ri
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
                      <small>Total Raporte</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-file-medical fa-2x opacity-50"></i>
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
                      <h4 className="mb-0">{stats.patients}</h4>
                      <small>Pacientë të Ndryshëm</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-users fa-2x opacity-50"></i>
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
                      <h4 className="mb-0">{stats.thisMonth}</h4>
                      <small>Këtë Muaj</small>
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
                      <h4 className="mb-0">{raportet.filter(r => r.updatedAt).length}</h4>
                      <small>Raportet e Përditësuara</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-edit fa-2x opacity-50"></i>
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
                  <h5 className="mb-0">Lista e Raporteve</h5>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-end">
                    <select 
                      className="form-select w-auto"
                      value={filterPatient}
                      onChange={(e) => setFilterPatient(e.target.value)}
                    >
                      <option value="Të gjitha">Të gjithë pacientët</option>
                      {uniquePatients.map(patient => (
                        <option key={patient} value={patient}>{patient}</option>
                      ))}
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
                  <p className="mt-2">Duke ngarkuar raportet...</p>
                </div>
              ) : filteredRaportet.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-file-medical fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Nuk ka raporte</h5>
                  <p className="text-muted">Shtoni raportin tuaj të parë duke klikuar butonin "Raport i Ri"</p>
                  <Link to="/add-raportin" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Shto Raport të Ri
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Titulli</th>
                        <th>Pacienti</th>
                        <th>Diagnoza</th>
                        <th>Data</th>
                        <th className="text-center" width="200">Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRaportet.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <div>
                              <div className="fw-bold">{r.title}</div>
                              {r.description && (
                                <small className="text-muted text-truncate d-block" style={{maxWidth: '300px'}}>
                                  {r.description}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{r.patientName}</div>
                              <small className="text-muted">{r.psikologName}</small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark px-3 py-2" title={r.diagnoza}>
                              {r.diagnoza.length > 25 
                                ? `${r.diagnoza.substring(0, 25)}...` 
                                : r.diagnoza
                              }
                            </span>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{new Date(r.createdAt).toLocaleDateString('sq-AL')}</div>
                              <small className="text-muted">
                                {r.updatedAt && r.updatedAt !== r.createdAt ? (
                                  <span className="text-info">
                                    Përditësuar
                                  </span>
                                ) : (
                                  <span className="text-success">
                                    E re
                                  </span>
                                )}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/edit-raportin/${r.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="fas fa-edit me-1"></i>
                                Modifiko
                              </Link>
                              
                              <button
                                onClick={() => handleDelete(r.id)}
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
              Duke shfaqur {filteredRaportet.length} nga {raportet.length} raporte totale
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenaxhoRaportet;