import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUshtrimById, updateUshtrim } from "../../services/UshtrimiService";
import axios from "axios";
import PsikologSidePanel from "./PsikologSidePanel";

function EditUshtrimin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulli: "",
    pershkrimi: "",
    patientId: "",
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ushtrimLoading, setUshtrimLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUshtrimLoading(true);
        setPatientsLoading(true);

        const ushtrimResponse = await getUshtrimById(id);
        const ushtrim = ushtrimResponse.data;

        setFormData({
          titulli: ushtrim.titulli || "",
          pershkrimi: ushtrim.pershkrimi || "",
          patientId: ushtrim.patientId ? ushtrim.patientId.toString() : "",
        });

        const patientsRes = await axios.get(
          "https://localhost:7062/api/Patient/get-all",
          { withCredentials: true }
        );
        setPatients(patientsRes.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
        toast.error("Gabim gjatë marrjes së të dhënave të ushtrimit");
      } finally {
        setUshtrimLoading(false);
        setPatientsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        psikologId: parseInt(localStorage.getItem("psikologId")),
        patientId: formData.patientId ? parseInt(formData.patientId) : null,
      };

      console.log("Duke dërguar të dhënat e përditësuara:", submitData);

      await updateUshtrim(id, submitData);

      toast.success("Ushtrimi u përditësua me sukses!");

      setTimeout(() => {
        navigate("/menaxho-ushtrimet");
      }, 1500);
    } catch (error) {
      console.error("Gabim i detajuar:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.errors?.[0] ||
          error.response.data ||
          "Gabim gjatë përditësimit të ushtrimit!";
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
      <PsikologSidePanel section="ushtrime" activePath="/menaxho-ushtrimet" />

      {/* Përmbajtja kryesore */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}
      >
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow border-0">
                <div className="card-header bg-warning text-dark py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-edit me-2"></i>
                      Modifiko Ushtrimin
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
                  {ushtrimLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Duke ngarkuar...</span>
                      </div>
                      <p className="mt-2">
                        Duke ngarkuar të dhënat e ushtrimit...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {/* Titulli */}
                      <div className="mb-4">
                        <label
                          htmlFor="titulli"
                          className="form-label fw-semibold"
                        >
                          <i className="fas fa-heading me-2 text-warning"></i>
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
                      </div>

                      {/* Përshkrimi */}
                      <div className="mb-4">
                        <label
                          htmlFor="pershkrimi"
                          className="form-label fw-semibold"
                        >
                          <i className="fas fa-align-left me-2 text-warning"></i>
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
                      </div>

                      {/* Zgjedhja e Pacientit */}
                      <div className="mb-4">
                        <label
                          htmlFor="patientId"
                          className="form-label fw-semibold"
                        >
                          <i className="fas fa-user me-2 text-warning"></i>
                          Zgjidh Pacientin{" "}
                          <span className="text-muted">(Opsionale)</span>
                        </label>
                        {patientsLoading ? (
                          <div className="text-center py-3">
                            <div className="spinner-border spinner-border-sm text-warning me-2"></div>
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

                      <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        <strong>Kujdes!</strong> Ndryshimet do të aplikohen
                        menjëherë pas ruajtjes.
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
                          className="btn btn-warning btn-lg py-3 fw-semibold text-dark order-md-2 flex-grow-1 ms-md-2"
                          disabled={loading || patientsLoading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
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

export default EditUshtrimin;
