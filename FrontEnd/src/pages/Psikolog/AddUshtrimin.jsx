import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addUshtrim } from "../../services/UshtrimiService";
import axios from "axios";
import PsikologSidePanel from "./PsikologSidePanel";

function AddUshtrimin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulli: "",
    pershkrimi: "",
    psikologId: "",
   
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsRes = await axios.get(
          "https://localhost:7062/api/Patient/get-all",
          { withCredentials: true }
        );
        setPatients(patientsRes.data);

        const psikologId = localStorage.getItem("psikologId");
        if (psikologId) {
          setFormData((prev) => ({ ...prev, psikologId }));
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
        toast.error("Gabim gjatë marrjes së të dhënave fillestare");
      } finally {
        setPatientsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulli.trim()) {
      toast.error("Titulli është i detyrueshëm!");
      return;
    }

    if (!formData.pershkrimi.trim()) {
      toast.error("Përshkrimi është i detyrueshëm!");
      return;
    }

    if (!formData.psikologId) {
      toast.error("Nuk është gjetur ID e psikologut!");
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        titulli: formData.titulli.trim(),
        pershkrimi: formData.pershkrimi.trim(),
        psikologId: parseInt(formData.psikologId),
      };

      console.log("🔄 Duke dërguar të dhënat:", submitData);

      const response = await addUshtrim(submitData);
      console.log("✅ Përgjigja nga serveri:", response);

      toast.success("Ushtrimi u shtua me sukses!");

      setFormData({
        titulli: "",
        pershkrimi: "",
        psikologId: formData.psikologId,

      });

      setTimeout(() => {
        navigate("/menaxho-ushtrimet");
      }, 1500);
    } catch (error) {
      console.error("❌ Gabim i detajuar:", error);
      console.error("📋 Të dhënat e gabimit:", error.response?.data);

      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = "Gabim gjatë krijimit të ushtrimit!";

        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }

        toast.error(errorMessage);
      } else if (error.request) {
        toast.error(
          "Nuk u mor përgjigje nga serveri! Kontrolloni lidhjen tuaj."
        );
      } else {
        toast.error("Gabim i papritur: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/menaxho-ushtrimet");
  };

  const selectedPatient = patients.find(
    (p) => p.id === parseInt(formData.patientId)
  );

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <PsikologSidePanel section="ushtrime" activePath="/add-ushtrim" />

      {/* Përmbajtja kryesore */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}
      >
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow border-0">
                <div className="card-header bg-success text-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-dumbbell me-2"></i>
                      Shto Ushtrim të Ri
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
                    {/* Titulli */}
                    <div className="mb-4">
                      <label
                        htmlFor="titulli"
                        className="form-label fw-semibold"
                      >
                        <i className="fas fa-heading me-2 text-success"></i>
                        Titulli i Ushtrimit *
                      </label>
                      <input
                        id="titulli"
                        name="titulli"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Shkruani titullin e ushtrimit"
                        value={formData.titulli}
                        onChange={handleChange}
                        required
                      />
                      <div className="form-text">
                        Jepni një titull të qartë dhe përshkrues për ushtrimin.
                      </div>
                    </div>

                    {/* Përshkrimi */}
                    <div className="mb-4">
                      <label
                        htmlFor="pershkrimi"
                        className="form-label fw-semibold"
                      >
                        <i className="fas fa-align-left me-2 text-success"></i>
                        Përshkrimi i Ushtrimit *
                      </label>
                      <textarea
                        id="pershkrimi"
                        name="pershkrimi"
                        className="form-control form-control-lg"
                        placeholder="Përshkruani në detaje ushtrimin..."
                        rows="6"
                        value={formData.pershkrimi}
                        onChange={handleChange}
                        required
                      />
                      <div className="form-text">
                        Përshkruani hap pas hapi ushtrimin që pacientit duhet ta
                        kryejë.
                      </div>
                    </div>

                    {/* Zgjedhja e Pacientit */}
                    <div className="mb-4">
                      <label
                        htmlFor="patientId"
                        className="form-label fw-semibold"
                      >
                        <i className="fas fa-user me-2 text-success"></i>
                        Zgjidh Pacientin{" "}
                        <span className="text-muted">(Opsionale)</span>
                      </label>
                      {patientsLoading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-success me-2"></div>
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
                          >
                            <option value="">
                              Zgjidh një pacient (opsionale)
                            </option>
                            {patients.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.emri} {p.mbiemri}
                                {p.mosha && ` - ${p.mosha} vjeç`}
                                {p.diagnoza && ` (${p.diagnoza})`}
                              </option>
                            ))}
                          </select>

                          {selectedPatient && (
                            <div className="mt-3 p-3 bg-light rounded">
                              <h6 className="mb-2">
                                Informacion për pacientin:
                              </h6>
                              <div className="row small">
                                <div className="col-6">
                                  <strong>Emri:</strong> {selectedPatient.emri}{" "}
                                  {selectedPatient.mbiemri}
                                </div>
                                <div className="col-6">
                                  <strong>Mosha:</strong>{" "}
                                  {selectedPatient.mosha || "N/A"} vjeç
                                </div>
                                <div className="col-6">
                                  <strong>Gjinia:</strong>{" "}
                                  {selectedPatient.gjinia || "N/A"}
                                </div>
                                <div className="col-6">
                                  <strong>Diagnoza:</strong>{" "}
                                  {selectedPatient.diagnoza || "Asnjë"}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Informacion:</strong> Ushtrimi do të krijohet
                      automatikisht për psikologun tuaj dhe do të jetë i
                      disponueshëm për pacientin e caktuar (nëse zgjidhet).
                    </div>

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
                        className="btn btn-success btn-lg py-3 fw-semibold order-md-2 flex-grow-1 ms-md-2"
                        disabled={loading || patientsLoading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Duke krijuar...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Krijo Ushtrim
                          </>
                        )}
                      </button>
                    </div>

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

export default AddUshtrimin;
