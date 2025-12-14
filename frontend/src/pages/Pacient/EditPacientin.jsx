import React, { useState, useEffect } from "react";
import { updatePacientin, getAllPatients, getPatientById } from "../../services/PacientiService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditPacientinForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emri: "",
    mbiemri: "",
    username: "",
    email: "",
    mosha: "",
    gjinia: "",
    diagnoza: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      // Përdor getPatientById nëse e ke, ose përdor getAllPatients
      let patient;
      try {
        // Provojmë së pari me getPatientById nëse ekziston
        const res = await getPatientById(id);
        patient = res.data;
      } catch (error) {
        // Nëse nuk ekziston, përdorim getAllPatients
        console.log("Duke përdorur getAllPatients si fallback");
        const res = await getAllPatients();
        patient = res.data.find((p) => p.id === parseInt(id));
      }

      if (patient) {
        setFormData({
          emri: patient.emri || "",
          mbiemri: patient.mbiemri || "",
          username: patient.username || patient.user?.username || "",
          email: patient.email || patient.user?.email || "",
          mosha: patient.mosha || "",
          gjinia: patient.gjinia || "",
          diagnoza: patient.diagnoza || "",
        });
      } else {
        toast.error("Pacienti nuk u gjet!");
        navigate("/menaxhoPacientet");
      }
    } catch (error) {
      console.error("Gabim gjatë marrjes së të dhënave:", error);
      toast.error("Gabim gjatë marrjes së të dhënave të pacientit");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updatePacientin(id, formData);
      toast.success("Pacienti u përditësua me sukses!");
      
      // Merr role-in dhe navigo në faqen e duhur
      const role = localStorage.getItem("role") || JSON.parse(localStorage.getItem("user") || '{}').role;
      
      setTimeout(() => {
        if (role === "Admin") {
          navigate("/menaxhoPacientet");
        } else if (role === "Psikolog") {
          navigate("/menaxhoPacientet-Psikolog");
        }
      }, 1000);
      
    } catch (error) {
      console.error("Gabim gjatë përditësimit:", error);
      toast.error(error.response?.data || "Gabim gjatë përditësimit të pacientit!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    const role = localStorage.getItem("role") || JSON.parse(localStorage.getItem("user") || '{}').role;
    if (role === "Admin") {
      navigate("/menaxhoPacientet");
    } else if (role === "Psikolog") {
      navigate("/menaxhoPacientet-Psikolog");
    }
  };

  if (initialLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Duke ngarkuar...</span>
          </div>
          <p className="mt-3 fs-5">Duke ngarkuar të dhënat e pacientit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-header bg-warning text-dark py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-edit me-2"></i>
                  Përditëso Pacientin
                </h4>
                <button 
                  onClick={handleGoBack}
                  className="btn btn-outline-dark btn-sm"
                  type="button"
                >
                  <i className="fas fa-arrow-left me-1"></i>
                  Kthehu
                </button>
              </div>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Rreshti 1: Emri dhe Mbiemri */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="emri" className="form-label fw-semibold">
                      <i className="fas fa-user me-2 text-success"></i>
                      Emri *
                    </label>
                    <input
                      id="emri"
                      name="emri"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Shkruaj emrin"
                      value={formData.emri}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="mbiemri" className="form-label fw-semibold">
                      <i className="fas fa-user me-2 text-success"></i>
                      Mbiemri *
                    </label>
                    <input
                      id="mbiemri"
                      name="mbiemri"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Shkruaj mbiemrin"
                      value={formData.mbiemri}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Rreshti 2: Username dhe Email */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      <i className="fas fa-at me-2 text-success"></i>
                      Username *
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Username për login"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2 text-success"></i>
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Rreshti 3: Mosha dhe Gjinia */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="mosha" className="form-label fw-semibold">
                      <i className="fas fa-birthday-cake me-2 text-success"></i>
                      Mosha *
                    </label>
                    <input
                      id="mosha"
                      name="mosha"
                      type="number"
                      className="form-control form-control-lg"
                      placeholder="Shkruaj moshën"
                      value={formData.mosha}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="gjinia" className="form-label fw-semibold">
                      <i className="fas fa-venus-mars me-2 text-success"></i>
                      Gjinia *
                    </label>
                    <select
                      id="gjinia"
                      name="gjinia"
                      className="form-select form-select-lg"
                      value={formData.gjinia}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh gjininë</option>
                      <option value="Mashkull">Mashkull</option>
                      <option value="Femër">Femër</option>
                      <option value="Tjetër">Tjetër</option>
                    </select>
                  </div>
                </div>

                {/* Rreshti 4: Diagnoza */}
                <div className="mb-3">
                  <label htmlFor="diagnoza" className="form-label fw-semibold">
                    <i className="fas fa-file-medical me-2 text-success"></i>
                    Diagnoza Aktuale
                  </label>
                  <select
                    id="diagnoza"
                    name="diagnoza"
                    className="form-select form-select-lg"
                    value={formData.diagnoza}
                    onChange={handleChange}
                  >
                    <option value="">Zgjidh diagnozën (opsionale)</option>
                    <option value="Ankth">Ankth</option>
                    <option value="Depresion">Depresion</option>
                    <option value="Stres Postraumatik">Stres Postraumatik</option>
                    <option value="Çrregullime të Gjumit">Çrregullime të Gjumit</option>
                    <option value="Fobi">Fobi</option>
                    <option value="Çrregullime Ushqyerjeje">Çrregullime Ushqyerjeje</option>
                    <option value="Probleme Marrëdhëniesh">Probleme Marrëdhëniesh</option>
                    <option value="Probleme Punes">Probleme Punes</option>
                    <option value="Të tjera">Të tjera</option>
                    <option value="Për Vlerësim">Për Vlerësim</option>
                    <option value="I shëruar">I shëruar</option>
                  </select>
                  <div className="form-text">
                    Diagnoza mund të përditësohet gjatë procesit të trajtimit.
                  </div>
                </div>

                {/* Informacion për fjalëkalimin */}
                <div className="alert alert-info mt-3">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Informacion:</strong> Për të ndryshuar fjalëkalimin, 
                  përdorni funksionin e veçantë të ndryshimit të fjalëkalimit.
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPacientinForm;