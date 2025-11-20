import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getTreatmentPlanById, updateTreatmentPlan } from "../../services/TreatmentPlanService";
import { logoutUser } from "../../services/authService";

function EditTreatmentPlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    endDate: "",
    status: "OnHold",
    goals: ""
  });

  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  // Merr të dhënat e treatment plan nga backend
  useEffect(() => {
    const fetchTreatmentPlan = async () => {
      try {
        setPlanLoading(true);
        const response = await getTreatmentPlanById(id);
        const plan = response.data;
        
        setFormData({
          title: plan.title || "",
          description: plan.description || "",
          endDate: plan.endDate ? plan.endDate.split('T')[0] : "",
          status: plan.status || "OnHold",
          goals: plan.goals || ""
        });
      } catch (error) {
        console.error("Gabim gjatë marrjes së treatment plan:", error);
        toast.error("Gabim gjatë marrjes së të dhënave të planit");
      } finally {
        setPlanLoading(false);
      }
    };

    fetchTreatmentPlan();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`🔄 Ndryshim në ${name}:`, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("🔍 FormData para ruajtjes:", formData);
    
    // Validimi i të dhënave
    if (!formData.title.trim()) {
      toast.error("Title është i detyrueshëm!");
      return;
    }

    setLoading(true);

    try {
      console.log("📤 Duke dërguar të dhënat e përditësuara:", {
        id: id,
        data: formData
      });
      
      const response = await updateTreatmentPlan(id, formData);
      console.log("✅ Përgjigja nga serveri:", response);
      
      toast.success("Treatment Plan u përditësua me sukses!");
      
      // Navigo pas 1.5 sekondash
      setTimeout(() => {
        navigate("/menaxho-treatmentplan");
      }, 1500);
      
    } catch (error) {
      console.error("Gabim i detajuar:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.[0] || 
                           error.response.data ||
                           "Gabim gjatë përditësimit të treatment plan!";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Nuk u mor përgjigje nga serveri! Kontrolloni lidhjen tuaj.");
      } else {
        toast.error("Gabim i papritur: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/menaxho-treatmentplan");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar - I njëjtë si në AddTreatmentPlan */}
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

        {/* Psikologët Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>👨‍⚕️ Psikologët</small>
          </div>
          <Link to="/add-takimet" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto Takim
          </Link>
          <Link to="/menaxhoTakimet" className="nav-link text-white px-3 py-2 mb-1">
            📋 Menaxho Takimet
          </Link>
        </div>

        {/* Terapia Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>🧘 Terapia</small>
          </div>
          <Link to="/add-terapine" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto Seancë
          </Link>
          <Link to="/menaxhoTerapine" className="nav-link text-white px-3 py-2 mb-1">
            📋 Menaxho Seanca
          </Link>
        </div>

        {/* Pacientët Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>📖 Pacientët</small>
          </div>
          <Link to="/add-raportin" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto Raport
          </Link>
          <Link to="/menaxhoRaportet" className="nav-link text-white px-3 py-2 mb-1">
            👨‍⚕️ Menaxho Raportet
          </Link>
          <Link to="/pacientetEMi" className="nav-link text-white px-3 py-2 mb-1">
            👥 Pacientët e Mi
          </Link>
        </div>

        {/* Treatment Plan Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>📋 Treatment Plan</small>
          </div>
          <Link to="/add-treatmentplan" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto Plan
          </Link>
          <Link to="/menaxho-treatmentplan" className="nav-link text-white px-3 py-2 mb-1">
            📊 Menaxho Planet
          </Link>
        </div>
        
        <div className="mt-auto">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={handleGoBack} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow border-0">
                <div className="card-header bg-warning text-dark py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-edit me-2"></i>
                      Modifiko Treatment Plan
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
                  {planLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Duke ngarkuar...</span>
                      </div>
                      <p className="mt-2">Duke ngarkuar të dhënat e planit...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {/* Titulli */}
                      <div className="mb-4">
                        <label htmlFor="title" className="form-label fw-semibold">
                          <i className="fas fa-heading me-2 text-warning"></i>
                          Titulli i Planit *
                        </label>
                        <input
                          id="title"
                          name="title"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Shkruani titullin e treatment plan"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Statusi */}
                      <div className="mb-4">
                        <label htmlFor="status" className="form-label fw-semibold">
                          <i className="fas fa-info-circle me-2 text-warning"></i>
                          Statusi i Planit
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="form-select form-select-lg"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="OnHold">Në Pritje</option>
                          <option value="Active">Aktiv</option>
                          <option value="Completed">I Përfunduar</option>
                          <option value="Cancelled">I Anuluar</option>
                        </select>
                        <div className="form-text">
                          Zgjidhni statusin aktual të planit të trajtimit.
                        </div>
                      </div>

                      {/* Data e Mbarimit */}
                      <div className="mb-4">
                        <label htmlFor="endDate" className="form-label fw-semibold">
                          <i className="fas fa-calendar-check me-2 text-warning"></i>
                          Data e Mbarimit
                        </label>
                        <input
                          id="endDate"
                          name="endDate"
                          type="date"
                          className="form-control form-control-lg"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                        <div className="form-text">
                          Opsionale - specifikoni datën kur përfundon trajtimi.
                        </div>
                      </div>

                      {/* Përshkrimi */}
                      <div className="mb-4">
                        <label htmlFor="description" className="form-label fw-semibold">
                          <i className="fas fa-align-left me-2 text-warning"></i>
                          Përshkrimi i Planit
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          className="form-control form-control-lg"
                          placeholder="Përshkruani në detaje planin e trajtimit..."
                          rows="4"
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Qëllimet */}
                      <div className="mb-4">
                        <label htmlFor="goals" className="form-label fw-semibold">
                          <i className="fas fa-bullseye me-2 text-warning"></i>
                          Qëllimet e Trajtimit
                        </label>
                        <textarea
                          id="goals"
                          name="goals"
                          className="form-control form-control-lg"
                          placeholder="Përshkruani qëllimet dhe objektivat e trajtimit..."
                          rows="3"
                          value={formData.goals}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Informacion shtesë */}
                      <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        <strong>Kujdes!</strong> Ndryshimet do të aplikohen menjëherë pas ruajtjes.
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
                          className="btn btn-warning btn-lg py-3 fw-semibold text-dark order-md-2 flex-grow-1 ms-md-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Duke ruajtur...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Ruaj Ndryshimet
                            </>
                          )}
                        </button>
                      </div>

                      {/* Informacion shtesë */}
                      <div className="mt-3 text-center">
                        <small className="text-muted">
                          * Fushat e shënuara me yll janë të detyrueshme
                        </small>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTreatmentPlan;