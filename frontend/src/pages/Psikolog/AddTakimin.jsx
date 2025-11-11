import React, { useState, useEffect } from "react";
import { addTakimin } from "../../services/AppointmentService";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

function AddTakimin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patientId');

  const [formData, setFormData] = useState({
    psikologId: localStorage.getItem("psikologId"),
    patientId: patientIdFromUrl || "",
    appointmentDate: "",
    notes: "",
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);

  useEffect(() => {
    // Merr të gjithë pacientët nga backend
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
    const processedValue = name === "patientId" ? parseInt(value) || "" : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId) {
      toast.error("Zgjidhni një pacient!");
      return;
    }

    if (!formData.appointmentDate) {
      toast.error("Zgjidhni datën dhe kohën e takimit!");
      return;
    }

    // Kontrollo nëse data është në të kaluar
    const selectedDate = new Date(formData.appointmentDate);
    const now = new Date();
    if (selectedDate < now) {
      toast.error("Data e takimit nuk mund të jetë në të kaluar!");
      return;
    }

    setLoading(true);

    try {
      await addTakimin(formData);
      toast.success("Takimi u shtua me sukses!");
      
      // Navigo pas 1.5 sekondash
      setTimeout(() => {
        navigate("/menaxhoTakimet");
      }, 1500);
      
    } catch (error) {
      console.error("Gabim:", error);
      toast.error(
        error.response?.data || "Gabim gjatë shtimit të takimit!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/menaxhoTakimet");
  };

  // Gjej pacientin e selektuar për të shfaqur informacion shtesë
  const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));

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
            <Link to="/add-takimet" className="nav-link text-white active">
              ➕ Shto Takim
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
                      <i className="fas fa-calendar-plus me-2"></i>
                      Shto Takim të Ri
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

                    {/* Data dhe Koha e Takimit */}
                    <div className="mb-4">
                      <label htmlFor="appointmentDate" className="form-label fw-semibold">
                        <i className="fas fa-clock me-2 text-primary"></i>
                        Data dhe Koha e Takimit *
                      </label>
                      <input
                        id="appointmentDate"
                        name="appointmentDate"
                        type="datetime-local"
                        className="form-control form-control-lg"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      <div className="form-text">
                        Zgjidhni datën dhe kohën e takimit. Nuk lejohen data të kaluara.
                      </div>
                    </div>

                    {/* Shënime */}
                    <div className="mb-4">
                      <label htmlFor="notes" className="form-label fw-semibold">
                        <i className="fas fa-sticky-note me-2 text-primary"></i>
                        Shënime dhe Përshkrim
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="form-control form-control-lg"
                        placeholder="Shkruani shënime shtesë për takimin (arsyeja, synimet, etj.)"
                        rows="4"
                        value={formData.notes}
                        onChange={handleChange}
                      />
                      <div className="form-text">
                        Opsionale - mund të përmbajë informacion shtesë për takimin.
                      </div>
                    </div>

                    {/* Informacion shtesë */}
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Informacion:</strong> Takimi do të shfaqet si "I planifikuar" dhe 
                      mund të ndryshohet statusi më vonë nga faqja e menaxhimit të takimeve.
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
                            <i className="fas fa-calendar-check me-2"></i>
                            Krijo Takim
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




export default AddTakimin;