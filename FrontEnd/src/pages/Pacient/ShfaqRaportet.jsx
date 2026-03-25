import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyRaportet } from "../../services/RaportService";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function ShfaqRaportet() {
  const navigate = useNavigate();
  const [raportet, setRaportet] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    fetchRaportet();
  }, []);

  const fetchRaportet = async () => {
    try {
      setLoading(true);
      const response = await getMyRaportet();
      console.log("📊 Raportet e mia:", response.data);
      setRaportet(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së raporteve:", error);
      toast.error("Gabim gjatë marrjes së raporteve");
    } finally {
      setLoading(false);
    }
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
            <Link to="/shfaqRaportet" className="nav-link text-white active">
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
            <Link to="/shfaqPsikologet" className="nav-link text-white">
              �‍⚕️ Psikologët
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={() => navigate('/pacientDashboard')} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Raportet e Mia</h2>
            <div className="text-muted">
              {new Date().toLocaleDateString('sq-AL')}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Duke ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar raportet...</p>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-file-medical me-2"></i>
                  Lista e Raporteve ({raportet.length})
                </h5>
              </div>
              <div className="card-body p-0">
                {raportet.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-file-medical fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Nuk keni raporte</h5>
                    <p className="text-muted">Raportet tuaja do të shfaqen këtu pasi psikologu të ketë shkruar ndonjë raport.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Titulli</th>
                          <th>Psikologu</th>
                          <th>Diagnoza</th>
                          <th>Data</th>
                          <th>Statusi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {raportet.map((rap) => (
                          <tr key={rap.id}>
                            <td>
                              <strong>{rap.title}</strong>
                              {rap.description && (
                                <br />
                              )}
                              {rap.description && (
                                <small className="text-muted">
                                  {rap.description.length > 50 
                                    ? `${rap.description.substring(0, 50)}...` 
                                    : rap.description
                                  }
                                </small>
                              )}
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {rap.psikologName || "Psikologu"}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-warning text-dark" title={rap.diagnoza}>
                                {rap.diagnoza?.length > 30 
                                  ? `${rap.diagnoza.substring(0, 30)}...` 
                                  : rap.diagnoza
                                }
                              </span>
                            </td>
                            <td>
                              <div>
                                <strong>{new Date(rap.createdAt).toLocaleDateString('sq-AL')}</strong>
                                <br />
                                <small className="text-muted">
                                  {rap.updatedAt && rap.updatedAt !== rap.createdAt ? (
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
                              <span className="badge bg-success">Aktiv</span>
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

export default ShfaqRaportet;