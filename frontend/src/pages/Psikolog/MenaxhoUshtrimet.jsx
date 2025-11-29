import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getUshtrimetForPsikolog,
  deleteUshtrim,
} from "../../services/UshtrimiService";
import { logoutUser } from "../../services/authService";

function MenaxhoUshtrimet() {
  const navigate = useNavigate();
  const [ushtrimet, setUshtrimet] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const psikologId = localStorage.getItem("psikologId");

      if (!psikologId) {
        toast.error("Nuk është gjetur ID e psikologut!");
        setLoading(false);
        return;
      }

      console.log("🔍 Duke kërkuar ushtrime për psikolog:", psikologId);

      const response = await getUshtrimetForPsikolog(psikologId);
      console.log("📋 Ushtrimet e marra:", response.data);
      setUshtrimet(response.data);
    } catch (error) {
      console.error("❌ Gabim gjatë marrjes së ushtrimeve:", error);
      console.error("📋 Detajet e gabimit:", error.response?.data);

      if (error.response?.status === 400) {
        toast.error("Gabim në kërkesë. Kontrolloni ID-në e psikologut.");
      } else {
        toast.error("Gabim gjatë marrjes së ushtrimeve");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë ushtrim?")) {
      try {
        await deleteUshtrim(id);
        toast.success("Ushtrimi u fshi me sukses!");
        fetchData();
      } catch (error) {
        toast.error("Gabim gjatë fshirjes së ushtrimit!");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("sq-AL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "250px", position: "fixed", height: "100vh" }}
      >
        <div className="mb-3">
          <Link
            to="/psikologDashboard"
            className="nav-link text-white px-3 py-2 mb-1 active"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "4px",
            }}
          >
            🏠 Dashboard
          </Link>
        </div>

        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small
              className="text-uppercase fw-semibold"
              style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
            >
              💪 Ushtrimet
            </small>
          </div>
          <Link
            to="/add-ushtrim"
            className="nav-link text-white px-3 py-2 mb-1"
          >
            ➕ Shto Ushtrim
          </Link>
          <Link
            to="/menaxho-ushtrimet"
            className="nav-link text-white px-3 py-2 mb-1 active"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "4px",
            }}
          >
            📊 Menaxho Ushtrimet
          </Link>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="btn btn-danger w-100 mb-2"
          >
            🚪 Logout
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary w-100"
          >
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}
      >
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Menaxho Ushtrimet</h2>
              <p className="text-muted mb-0">
                Menaxho të gjitha ushtrimet e tua
              </p>
            </div>
            <Link to="/add-ushtrim" className="btn btn-success">
              <i className="fas fa-plus me-2"></i>
              Ushtrim i Ri
            </Link>
          </div>

          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{ushtrimet.length}</h4>
                      <small>Total Ushtrime</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-dumbbell fa-2x opacity-50"></i>
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
                      <h4 className="mb-0">
                        {ushtrimet.filter((u) => u.patientId).length}
                      </h4>
                      <small>Për Pacientët</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-user fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">
                        {ushtrimet.filter((u) => !u.patientId).length}
                      </h4>
                      <small>Ushtrime të Përgjithshme</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-users fa-2x opacity-50"></i>
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
                      <h4 className="mb-0">
                        {new Set(ushtrimet.map((u) => u.patientId)).size - 1}
                      </h4>
                      <small>Pacientë të Ndryshem</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-user-friends fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Lista e Ushtrimeve ({ushtrimet.length})
              </h5>
            </div>

            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Duke ngarkuar...</span>
                  </div>
                  <p className="mt-2">Duke ngarkuar ushtrimet...</p>
                </div>
              ) : ushtrimet.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-dumbbell fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Nuk keni ushtrime</h5>
                  <p className="text-muted">
                    Shtoni ushtrimin tuaj të parë duke klikuar butonin "Ushtrim
                    i Ri"
                  </p>
                  <Link to="/add-ushtrim" className="btn btn-success">
                    <i className="fas fa-plus me-2"></i>
                    Shto Ushtrim të Ri
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Titulli</th>
                        <th>Përshkrimi</th>
                        <th>Pacienti</th>
                        <th>Data e Krijimit</th>
                        <th className="text-center" width="200">
                          Veprime
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ushtrimet.map((ushtrimi) => (
                        <tr key={ushtrimi.id}>
                          <td>
                            <div className="fw-bold text-success">
                              {ushtrimi.titulli}
                            </div>
                          </td>
                          <td>
                            <span title={ushtrimi.pershkrimi}>
                              {ushtrimi.pershkrimi.length > 80
                                ? `${ushtrimi.pershkrimi.substring(0, 80)}...`
                                : ushtrimi.pershkrimi}
                            </span>
                          </td>
                          <td>
                            {ushtrimi.patientId ? (
                              <div>
                                <div className="fw-semibold">
                                  ID: {ushtrimi.patientId}
                                </div>
                                <small className="text-muted">
                                  Pacient specifik
                                </small>
                              </div>
                            ) : (
                              <span className="text-muted fst-italic">
                                Ushtrim i përgjithshëm
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="text-muted small">
                              {formatDate(ushtrimi.dataKrijimit)}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/edit-ushtrim/${ushtrimi.id}`}
                                className="btn btn-sm btn-outline-warning"
                              >
                                <i className="fas fa-edit me-1"></i>
                                Modifiko
                              </Link>

                              <button
                                onClick={() => handleDelete(ushtrimi.id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                <i className="fas fa-trash me-1"></i>
                                Fshi
                              </button>

                              <Link
                                to={`/view-ushtrim/${ushtrimi.id}`}
                                className="btn btn-sm btn-outline-info"
                              >
                                <i className="fas fa-eye me-1"></i>
                                Shiko
                              </Link>
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

          <div className="mt-3">
            <small className="text-muted">
              Duke shfaqur {ushtrimet.length} ushtrime totale
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenaxhoUshtrimet;
