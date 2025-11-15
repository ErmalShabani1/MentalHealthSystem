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
            <Link to="/add-raportin" className="nav-link text-white">
              📝 Shto Raport
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoRaportet" className="nav-link text-white active">
              📊 Menaxho Raportet
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoTakimet" className="nav-link text-white">
              📋 Menaxho Takimet
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/pacientetEMi" className="nav-link text-white">
              👥 Pacientët e Mi
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={() => navigate(-1)} className="btn btn-secondary w-100">
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
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Titulli</th>
                        <th>Pacienti</th>
                        <th>Diagnoza</th>
                        <th>Data</th>
                        <th width="120">Veprimet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRaportet.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <div>
                              <strong>{r.title}</strong>
                              {r.description && (
                                <br />
                              )}
                              {r.description && (
                                <small className="text-muted">
                                  {r.description.length > 50 
                                    ? `${r.description.substring(0, 50)}...` 
                                    : r.description
                                  }
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{r.patientName}</strong>
                              <br />
                              <small className="text-muted">
                                Psikologu: {r.psikologName}
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark" title={r.diagnoza}>
                              {r.diagnoza.length > 30 
                                ? `${r.diagnoza.substring(0, 30)}...` 
                                : r.diagnoza
                              }
                            </span>
                          </td>
                          <td>
                            <div>
                              <strong>{new Date(r.createdAt).toLocaleDateString('sq-AL')}</strong>
                              <br />
                              <small className="text-muted">
                                {r.updatedAt && r.updatedAt !== r.createdAt ? (
                                  <span className="text-info">
                                    <i className="fas fa-edit me-1"></i>
                                    Përditësuar
                                  </span>
                                ) : (
                                  <span className="text-success">
                                    <i className="fas fa-plus me-1"></i>
                                    Krijuar
                                  </span>
                                )}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <Link
                                to={`/edit-raportin/${r.id}`}
                                className="btn btn-outline-warning"
                                title="Modifiko raportin"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="btn btn-outline-danger"
                                title="Fshi raportin"
                              >
                                <i className="fas fa-trash"></i>
                              </button>

                              {/* Butoni për shikim të shpejtë */}
                              <button
                                className="btn btn-outline-info"
                                title="Shiko detajet"
                                onClick={() => {
                                  // Mund të implementohet një modal për shikim të shpejtë
                                  toast.info(`Diagnoza: ${r.diagnoza}`);
                                }}
                              >
                                <i className="fas fa-eye"></i>
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