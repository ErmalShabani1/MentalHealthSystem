import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPsikologet } from "../../services/PsikologiService";
import { toast } from "react-toastify";

function ShfaqPsikologet() {
  const [psikologet, setPsikologet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPsikologet();
  }, []);

  const fetchPsikologet = async () => {
    try {
      setLoading(true);
      const response = await getAllPsikologet();
      console.log("👨‍⚕️ Psikologët:", response.data);
      setPsikologet(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së psikologëve:", error);
      toast.error("Gabim gjatë marrjes së listës së psikologëve");
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
            <Link to="/raportetEMia" className="nav-link text-white">
              📊 Raportet e Mia
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/takimetEMia" className="nav-link text-white">
              📅 Takimet e Mia
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/psikologet" className="nav-link text-white active">
              👨‍⚕️ Psikologët
            </Link>
          </li>
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Psikologët</h2>
            <div className="text-muted">
              {new Date().toLocaleDateString('sq-AL')}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Duke ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar psikologët...</p>
            </div>
          ) : (
            <div className="row">
              {psikologet.length === 0 ? (
                <div className="col-12">
                  <div className="card shadow-sm text-center py-5">
                    <i className="fas fa-user-md fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Nuk ka psikologë të regjistruar</h5>
                  </div>
                </div>
              ) : (
                psikologet.map((psikolog) => (
                  <div key={psikolog.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card shadow-sm h-100">
                      <div className="card-body text-center">
                        <div className="mb-3">
                          <i className="fas fa-user-md fa-3x text-primary"></i>
                        </div>
                        <h5 className="card-title">{psikolog.name} {psikolog.surname}</h5>
                        <p className="card-text text-muted">
                          <i className="fas fa-envelope me-2"></i>
                          {psikolog.email}
                        </p>
                        {psikolog.phone && (
                          <p className="card-text text-muted">
                            <i className="fas fa-phone me-2"></i>
                            {psikolog.phone}
                          </p>
                        )}
                        {psikolog.specialization && (
                          <p className="card-text">
                            <span className="badge bg-info">
                              {psikolog.specialization}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="card-footer bg-transparent">
                        <small className="text-muted">
                          <i className="fas fa-id-card me-1"></i>
                          ID: {psikolog.id}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShfaqPsikologet;