import React, { useState, useEffect } from "react";
import { createTherapySession } from "../../services/TherapySessionService";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function AddTerapine() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patientId');

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const [formData, setFormData] = useState({
    patientId: patientIdFromUrl || "",
    sessionDate: "",
    durationMinutes: 60,
    notes: "",
    moodAfter: "",
    goals: "",
    exercises: "",
    moodBefore: "",
    status: "Scheduled"
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);

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
    const processedValue = name === "patientId" || name === "durationMinutes" 
      ? parseInt(value) || "" 
      : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ handleSubmit u thirr!");
    console.log("📋 Form Data:", formData);
    
    if (!formData.patientId) {
      toast.error("Zgjidhni një pacient!");
      return;
    }

    if (!formData.sessionDate) {
      toast.error("Zgjidhni datën dhe kohën e seancës!");
      return;
    }

    const selectedDate = new Date(formData.sessionDate);
    const now = new Date();
    if (selectedDate < now) {
      toast.error("Data e seancës nuk mund të jetë në të kaluar!");
      return;
    }

    setLoading(true);

    try {
      console.log("Duke dërguar të dhënat:", formData);
      const result = await createTherapySession(formData);
      console.log("Përgjigja nga serveri:", result);
      
      toast.success("Seanca u shtua me sukses!");
      
      setFormData({
        patientId: patientIdFromUrl || "",
        sessionDate: "",
        durationMinutes: 60,
        notes: "",
        moodAfter: "",
        goals: "",
        exercises: "",
        moodBefore: "",
        status: "Scheduled"
      });
      
      setTimeout(() => {
        navigate("/menaxhoTerapine");
      }, 1500);
      
    } catch (error) {
      console.error("Gabim i detajuar:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.[0] || 
                           error.response.data ||
                           "Gabim gjatë shtimit të seancës!";
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

  const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "250px", position: "fixed", height: "100vh" }}
      >
        <div className="mb-3">
          <Link to="/psikologDashboard" className="nav-link text-white px-3 py-2 mb-1" style={{borderRadius: '4px'}}>
            🏠 Dashboard
          </Link>
        </div>

        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>🧘 Terapia</small>
          </div>
          <Link to="/add-terapine" className="nav-link text-white px-3 py-2 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px'}}>
            ➕ Shto Seancë
          </Link>
          <Link to="/menaxhoTerapine" className="nav-link text-white px-3 py-2 mb-1">
            📋 Menaxho Seanca
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

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h4 className="mb-0">🧘 Shto Seancë të Re</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    {/* Patient Selection */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Zgjidh Pacientin <span className="text-danger">*</span></label>
                      {patientsLoading ? (
                        <p className="text-muted">Duke ngarkuar pacientët...</p>
                      ) : (
                        <select
                          name="patientId"
                          className="form-select"
                          value={formData.patientId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Zgjidhni një pacient --</option>
                          {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                              {patient.emri} {patient.mbiemri} - {patient.diagnoza}
                            </option>
                          ))}
                        </select>
                      )}
                      {selectedPatient && (
                        <div className="alert alert-info mt-2 mb-0">
                          <strong>Pacienti:</strong> {selectedPatient.emri} {selectedPatient.mbiemri}<br />
                          <strong>Mosha:</strong> {selectedPatient.mosha} vjeç | <strong>Gjinia:</strong> {selectedPatient.gjinia}<br />
                          <strong>Diagnoza:</strong> {selectedPatient.diagnoza}
                        </div>
                      )}
                    </div>

                    {/* Session Date & Time */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Data dhe Koha <span className="text-danger">*</span></label>
                      <input
                        type="datetime-local"
                        name="sessionDate"
                        className="form-control"
                        value={formData.sessionDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Duration */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Kohëzgjatja (minuta) <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        name="durationMinutes"
                        className="form-control"
                        value={formData.durationMinutes}
                        onChange={handleChange}
                        min="15"
                        max="300"
                        required
                      />
                      <small className="text-muted">Minimumi 15 minuta, maksimumi 300 minuta</small>
                    </div>

                    {/* Goals */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Qëllimet e Seancës</label>
                      <textarea
                        name="goals"
                        className="form-control"
                        rows="2"
                        value={formData.goals}
                        onChange={handleChange}
                        placeholder="Cakto qëllimet për këtë seancë..."
                        maxLength="500"
                      />
                      <small className="text-muted">{formData.goals.length}/500 karaktere</small>
                    </div>

                    {/* Exercises */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Ushtrimet për Seancën</label>
                      <textarea
                        name="exercises"
                        className="form-control"
                        rows="3"
                        value={formData.exercises}
                        onChange={handleChange}
                        placeholder="Përcakto ushtrimet që pacienti duhet të bëjë gjatë seancës..."
                        maxLength="1000"
                      />
                      <small className="text-muted">{formData.exercises.length}/1000 karaktere</small>
                    </div>

                    {/* Mood Before Session */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Gjendja Emocionale para Seancës</label>
                      <select
                        name="moodBefore"
                        className="form-select"
                        value={formData.moodBefore}
                        onChange={handleChange}
                      >
                        <option value="">-- Zgjidhni gjendjen --</option>
                        <option value="Shumë i mirë">😊 Shumë i mirë</option>
                        <option value="I mirë">🙂 I mirë</option>
                        <option value="Neutral">😐 Neutral</option>
                        <option value="I shqetësuar">😟 I shqetësuar</option>
                        <option value="Shumë i shqetësuar">😰 Shumë i shqetësuar</option>
                        <option value="Depresiv">😢 Depresiv</option>
                      </select>
                    </div>

                    {/* Mood After Session */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Gjendja Emocionale pas Seancës</label>
                      <select
                        name="moodAfter"
                        className="form-select"
                        value={formData.moodAfter}
                        onChange={handleChange}
                      >
                        <option value="">-- Zgjidhni gjendjen --</option>
                        <option value="Shumë i mirë">😊 Shumë i mirë</option>
                        <option value="I mirë">🙂 I mirë</option>
                        <option value="Neutral">😐 Neutral</option>
                        <option value="I shqetësuar">😟 I shqetësuar</option>
                        <option value="Shumë i shqetësuar">😰 Shumë i shqetësuar</option>
                        <option value="Depresiv">😢 Depresiv</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Shënime <span className="text-danger">*</span></label>
                      <textarea
                        name="notes"
                        className="form-control"
                        rows="4"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Shto shënime të detajuara për seancën..."
                        maxLength="1000"
                        required
                      />
                      <small className="text-muted">{formData.notes.length}/1000 karaktere</small>
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">Statusi</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Scheduled">I planifikuar</option>
                        <option value="Completed">I përfunduar</option>
                        <option value="Cancelled">I anuluar</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary flex-grow-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Duke ruajtur...
                          </>
                        ) : (
                          "✅ Ruaj Seancën"
                        )}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => navigate("/menaxhoTerapine")} 
                        className="btn btn-secondary"
                      >
                        Anulo
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

export default AddTerapine;
