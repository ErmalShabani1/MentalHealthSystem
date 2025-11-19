import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { addRaportin } from "../../services/RaportService";
import { logoutUser } from "../../services/authService";
function AddRaportinForm() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const [formData, setFormData] = useState({

    patientId: "",
    title: "",
    description: "",
    diagnoza: "",
    appointmentId: ""
  });

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);

  useEffect(() => {
    // Merr të gjithë pacientët
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

    // Merr takimet e psikologut
    const fetchAppointments = async () => {
      try {
        const psikologId = localStorage.getItem("psikologId");
        const res = await axios.get(`https://localhost:7062/api/Appointments/psikolog/${psikologId}`, {
          withCredentials: true,
        });
        setAppointments(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së takimeve:", error);
      }
    };

    fetchPatients();
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === "patientId" || name === "appointmentId" 
      ? parseInt(value) || "" 
      : value;
    
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Kontrollo nëse PatientId është zgjedhur
  if (!formData.patientId) {
    toast.error("Zgjidhni një pacient!");
    return;
  }

  // Transformo të dhënat për backend (PascalCase)
  const dataToSend = {
    PatientId: parseInt(formData.patientId),
    Title: formData.title,
    Description: formData.description || "",
    Diagnoza: formData.diagnoza,
    AppointmentId: formData.appointmentId ? parseInt(formData.appointmentId) : null
  };

  console.log("🔍 Duke dërguar të dhënat:", dataToSend);

  setLoading(true);

   try {
    const result = await addRaportin(dataToSend);
    console.log("Përgjigja nga serveri:", result);
    toast.success("Raporti u shtua me sukses!");
      
      // Reset form data
      setFormData({
        patientId: "",
        title: "",
        description: "",
        diagnoza: "",
        appointmentId: ""
      });
      
      // Navigo pas 1.5 sekondash
      setTimeout(() => {
        navigate("/menaxhoRaportet");
      }, 1500);
      
    } catch (error) {
      console.error("Gabim i detajuar:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response) {
        // Shfaq mesazhin e gabimit nga backend-i
        let errorMessage = "Gabim gjatë shtimit të raportit!";
        
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(', ');
        }
        
        console.error("📛 Error message to display:", errorMessage);
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
    navigate("/menaxhoRaportet");
  };

  // Gjej pacientin e selektuar
  const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));

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
          <Link to="/add-raportin" className="nav-link text-white px-3 py-2 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px'}}>
            ➕ Shto Raport
          </Link>
          <Link to="/menaxhoRaportet" className="nav-link text-white px-3 py-2 mb-1">
            👨‍⚕️ Menaxho Raportet
          </Link>
        </div>
        
        <div className="mt-auto">
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
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div className="card shadow border-0">
                <div className="card-header bg-primary text-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-file-medical me-2"></i>
                      Shto Raport të Ri
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
                        Titulli i Raportit *
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Shkruani titullin e raportit"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Përshkrimi */}
                    <div className="mb-4">
                      <label htmlFor="description" className="form-label fw-semibold">
                        <i className="fas fa-align-left me-2 text-primary"></i>
                        Përshkrimi i Raportit
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control form-control-lg"
                        placeholder="Shkruani përshkrimin e detajuar të raportit..."
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      <div className="form-text">
                        Opsionale - përshkrim i detajuar i gjendjes dhe vëzhgimeve.
                      </div>
                    </div>

                    {/* Diagnoza */}
                    <div className="mb-4">
                      <label htmlFor="diagnoza" className="form-label fw-semibold">
                        <i className="fas fa-stethoscope me-2 text-primary"></i>
                        Diagnoza dhe Vlerësimi *
                      </label>
                      <textarea
                        id="diagnoza"
                        name="diagnoza"
                        className="form-control form-control-lg"
                        placeholder="Shkruani diagnozën dhe vlerësimin klinik..."
                        rows="4"
                        value={formData.diagnoza}
                        onChange={handleChange}
                        required
                      />
                      <div className="form-text">
                        Diagnoza kryesore dhe vlerësimi i gjendjes së pacientit.
                      </div>
                    </div>

                    {/* Takimi i lidhur */}
                    <div className="mb-4">
                      <label htmlFor="appointmentId" className="form-label fw-semibold">
                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                        Takimi i Lidhur (Opsionale)
                      </label>
                      <select
                        id="appointmentId"
                        name="appointmentId"
                        className="form-select form-select-lg"
                        value={formData.appointmentId}
                        onChange={handleChange}
                      >
                        <option value="">Zgjidhni një takim (opsionale)</option>
                        {appointments.map((app) => (
                          <option key={app.id} value={app.id}>
                            {new Date(app.appointmentDate).toLocaleDateString('sq-AL')} - {app.patientName}
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        Lidhni raportin me një takim specifik (opsionale).
                      </div>
                    </div>

                    {/* Informacion shtesë */}
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Informacion:</strong> Raporti do të ruhet në sistem dhe do të jetë 
                      i dukshëm për pacientin dhe administratorët sipas roleve të tyre.
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
                            Duke shtuar...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Ruaj Raportin
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

export default AddRaportinForm;