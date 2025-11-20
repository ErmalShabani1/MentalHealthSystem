import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addTreatmentPlan } from "../../services/TreatmentPlanService";
import { logoutUser } from "../../services/authService";
import axios from "axios";

function AddTreatmentPlan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: "",
    title: "",
    description: "",
    startDate: "",
    goals: ""
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  // Merr të gjithë pacientët nga backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get("https://localhost:7062/api/Patient/get-all", {
          withCredentials: true,
        });
        setPatients(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së pacientëve:", error);
        toast.error("Gabim gjatë marrjes së listës së pacientëve");
      } finally {
        setPatientsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validimi i të dhënave
    if (!formData.patientId) {
      toast.error("Zgjidhni një pacient!");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title është i detyrueshëm!");
      return;
    }

    if (!formData.startDate) {
      toast.error("Data e fillimit është e detyrueshme!");
      return;
    }

    // Kontrollo nëse data është në të kaluar
    const selectedDate = new Date(formData.startDate);
    const now = new Date();
    if (selectedDate < now) {
      toast.error("Data e fillimit nuk mund të jetë në të kaluar!");
      return;
    }

    setLoading(true);

    try {
      console.log("Duke dërguar të dhënat:", formData);
      
    const result = await addTreatmentPlan(formData);
      console.log("Përgjigja nga serveri:", result);
      
      toast.success("Treatment Plan u krijua me sukses!");
      
      // Reset form data
      setFormData({
        patientId: "",
        title: "",
        description: "",
        startDate: "",
        goals: ""
      });
      
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
                           "Gabim gjatë krijimit të treatment plan!";
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

  // Gjej pacientin e selektuar për të shfaqur informacion shtesë
  const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar - I njëjtë si në PsikologDashboard */}
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

        {/* Treatment Plan Section - E RE */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>📋 Treatment Plan</small>
          </div>
          <Link to="/add-treatmentplan" className="nav-link text-white px-3 py-2 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px'}}>
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
                <div className="card-header bg-primary text-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-clipboard-list me-2"></i>
                      Shto Treatment Plan të Ri
                    </h4>
                    <button 
                      onClick={handleGoBack}
                      className="btn btn-light btn-sm"
                      type="button"
                    >
                      <i className="fas fa-arrow-left me-1"></i>
                      Kthehu
                    </button>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    {/* Zgjedhja e Pacientit */}
                    <div className="mb-4">
                      <label htmlFor="patientId" className="form-label fw-semibold">
                        <i className="fas fa-user me-2 text-primary"></i>
                        Zgjidh Pacientin *
                      </label>
                      {patientsLoading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                          Duke ngarkuar pacientët...
                        </div>
                      ) : (
                        <>
                          <select
                            id="patientId"
                            name="patientId"
                            className="form-select form-select-lg"
                            value={formData.patientId}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Zgjidh një pacient nga lista</option>
                            {patients.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.emri} {p.mbiemri} 
                                {p.mosha && ` - ${p.mosha} vjeç`}
                                {p.diagnoza && ` (${p.diagnoza})`}
                              </option>
                            ))}
                          </select>
                          
                          {/* Informacion për pacientin e selektuar */}
                          {selectedPatient && (
                            <div className="mt-3 p-3 bg-light rounded">
                              <h6 className="mb-2">Informacion për pacientin:</h6>
                              <div className="row small">
                                <div className="col-6">
                                  <strong>Emri:</strong> {selectedPatient.emri} {selectedPatient.mbiemri}
                                </div>
                                <div className="col-6">
                                  <strong>Mosha:</strong> {selectedPatient.mosha || 'N/A'} vjeç
                                </div>
                                <div className="col-6">
                                  <strong>Gjinia:</strong> {selectedPatient.gjinia || 'N/A'}
                                </div>
                                <div className="col-6">
                                  <strong>Diagnoza:</strong> {selectedPatient.diagnoza || 'Asnjë'}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Titulli */}
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label fw-semibold">
                        <i className="fas fa-heading me-2 text-primary"></i>
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
                      <div className="form-text">
                        Jepni një titull të qartë dhe përshkrues për planin e trajtimit.
                      </div>
                    </div>

                    {/* Data e Fillimit */}
                    <div className="mb-4">
                      <label htmlFor="startDate" className="form-label fw-semibold">
                        <i className="fas fa-calendar-day me-2 text-primary"></i>
                        Data e Fillimit *
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        className="form-control form-control-lg"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <div className="form-text">
                        Zgjidhni datën kur fillon trajtimi. Nuk lejohen data të kaluara.
                      </div>
                    </div>

                    {/* Përshkrimi */}
                    <div className="mb-4">
                      <label htmlFor="description" className="form-label fw-semibold">
                        <i className="fas fa-align-left me-2 text-primary"></i>
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
                      <div className="form-text">
                        Opsionale - përmban informacion të detajuar për trajtimin.
                      </div>
                    </div>

                    {/* Qëllimet */}
                    <div className="mb-4">
                      <label htmlFor="goals" className="form-label fw-semibold">
                        <i className="fas fa-bullseye me-2 text-primary"></i>
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
                      <div className="form-text">
                        Opsionale - specifikoni qëllimet konkrete që dëshironi të arrini.
                      </div>
                    </div>

                    {/* Informacion shtesë */}
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Informacion:</strong> Treatment Plan-i do të krijohet me status "OnHold" 
                      dhe mund të përditësohet më vonë nga faqja e menaxhimit.
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
                        className="btn btn-primary btn-lg py-3 fw-semibold order-md-2 flex-grow-1 ms-md-2"
                        disabled={loading || patientsLoading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Duke krijuar...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Krijo Treatment Plan
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTreatmentPlan;