import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getRaportById, updateRaportin } from "../../services/RaportService";
import { Link } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function EditRaportinForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    diagnoza: "",
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchRaporti = async () => {
      try {
        setFetchLoading(true);
        console.log(`🔍 Duke kërkuar raportin me ID: ${id}`);
        
        const response = await getRaportById(id);
        console.log("✅ Përgjigja nga serveri:", response.data);
        
        setReport(response.data);
        setFormData({
          title: response.data.title || "",
          description: response.data.description || "",
          diagnoza: response.data.diagnoza || "",
        });
      } catch (error) {
        console.error("❌ Gabim gjatë marrjes së raportit:", error);
        
        // Shfaq error-in e detajuar
        if (error.response) {
          console.error("📋 Response data:", error.response.data);
          console.error("🔢 Status code:", error.response.status);
          toast.error(`Server Error: ${error.response.data}`);
        } else {
          toast.error("Gabim gjatë marrjes së të dhënave të raportit");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchRaporti();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Titulli është i detyrueshëm!");
      return;
    }

    if (!formData.diagnoza) {
      toast.error("Diagnoza është e detyrueshme!");
      return;
    }

    setLoading(true);

    try {
      console.log(`📤 Duke përditësuar raportin ${id} me të dhënat:`, formData);
      
      await updateRaportin(id, formData);
      
      toast.success("Raporti u përditësua me sukses!");
      
      setTimeout(() => {
        navigate("/menaxhoRaportet");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Gabim gjatë përditësimit:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.[0] || 
                           error.response.data ||
                           "Gabim gjatë përditësimit të raportit!";
        toast.error(errorMessage);
      } else {
        toast.error("Gabim gjatë përditësimit të raportit!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/menaxhoRaportet");
  };

  if (fetchLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Duke ngarkuar...</span>
        </div>
        <span className="ms-2">Duke ngarkuar raportin...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Raporti nuk u gjet!</h4>
          <p>Raporti me ID {id} nuk ekziston ose nuk keni qasje.</p>
          <button onClick={handleGoBack} className="btn btn-primary">
            Kthehu te Lista
          </button>
        </div>
      </div>
    );
  }

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
          <button onClick={() => navigate('/psikologDashboard')} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div className="card shadow border-0">
                <div className="card-header bg-warning text-dark py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-edit me-2"></i>
                      Përditëso Raportin
                    </h4>
                    <button 
                      onClick={handleGoBack}
                      className="btn btn-dark btn-sm"
                      type="button"
                    >
                      <i className="fas fa-arrow-left me-1"></i>
                      Kthehu
                    </button>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  {/* Informacion për raportin */}
                  <div className="alert alert-info mb-4">
                    <h6 className="alert-heading">Informacion për Raportin:</h6>
                    <div className="row small">
                      <div className="col-md-6">
                        <strong>Pacienti:</strong> {report.patientName}
                      </div>
                      <div className="col-md-6">
                        <strong>Data e krijimit:</strong> {new Date(report.createdAt).toLocaleDateString('sq-AL')}
                      </div>
                      <div className="col-md-6">
                        <strong>ID e Raportit:</strong> {id}
                      </div>
                      {report.updatedAt && (
                        <div className="col-md-6">
                          <strong>Përditësuar më:</strong> {new Date(report.updatedAt).toLocaleDateString('sq-AL')}
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Titulli */}
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label fw-semibold">
                        <i className="fas fa-heading me-2 text-warning"></i>
                        Titulli i Raportit *
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Përshkrimi */}
                    <div className="mb-4">
                      <label htmlFor="description" className="form-label fw-semibold">
                        <i className="fas fa-align-left me-2 text-warning"></i>
                        Përshkrimi i Raportit
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control form-control-lg"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Diagnoza */}
                    <div className="mb-4">
                      <label htmlFor="diagnoza" className="form-label fw-semibold">
                        <i className="fas fa-stethoscope me-2 text-warning"></i>
                        Diagnoza dhe Vlerësimi *
                      </label>
                      <textarea
                        id="diagnoza"
                        name="diagnoza"
                        className="form-control form-control-lg"
                        rows="4"
                        value={formData.diagnoza}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Butonat */}
                    <div className="d-grid gap-2 d-md-flex justify-content-between mt-4">
                      <button 
                        type="button"
                        onClick={handleGoBack}
                        className="btn btn-outline-secondary btn-lg py-3 fw-semibold order-md-1"
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Anulo
                      </button>
                      
                      <button 
                        type="submit" 
                        className="btn btn-warning btn-lg py-3 fw-semibold order-md-2 flex-grow-1 ms-md-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Duke përditësuar...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Ruaj Ndryshimet
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRaportinForm;