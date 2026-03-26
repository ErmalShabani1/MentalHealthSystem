import React, { useState, useEffect } from "react";
import { updatePsikologin, getAllPsikologet, getPsikologById } from "../../services/PsikologiService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditPsikologinForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    specialization: "",
    experienceLevel: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      // Përdor getPsikologById nëse e ke, ose përdor getAllPsikologet
      let psych;
      try {
        // Provojmë së pari me getPsikologById nëse ekziston
        const res = await getPsikologById(id);
        psych = res.data;
      } catch (error) {
        // Nëse nuk ekziston, përdorim getAllPsikologet
        console.log("Duke përdorur getAllPsikologet si fallback");
        const res = await getAllPsikologet();
        psych = res.data.find((p) => p.id === parseInt(id));
      }

      if (psych) {
        setFormData({
          name: psych.name || psych.emri || "",
          surname: psych.surname || psych.mbiemri || "",
          username: psych.username || psych.user?.username || "",
          email: psych.email || psych.user?.email || "",
          specialization: psych.specialization || psych.specializimi || "",
          experienceLevel: psych.experienceLevel || psych.experience || "",
        });
      } else {
        toast.error("Psikologu nuk u gjet!");
        navigate("/menaxhoPsikologet");
      }
    } catch (error) {
      console.error("Gabim gjatë marrjes së të dhënave:", error);
      toast.error("Gabim gjatë marrjes së të dhënave të psikologut");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updatePsikologin(id, formData);
      toast.success("Psikologu u përditësua me sukses!");
      
      // Navigo pas 1 sekonde
      setTimeout(() => {
        navigate("/menaxhoPsikologet");
      }, 1000);
      
    } catch (error) {
      console.error("Gabim gjatë përditësimit:", error);
      toast.error(error.response?.data || "Gabim gjatë përditësimit të psikologut!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/menaxhoPsikologet");
  };

  if (initialLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Duke ngarkuar...</span>
          </div>
          <p className="mt-3 fs-5">Duke ngarkuar të dhënat e psikologut...</p>
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
                  Përditëso Psikologun
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
                    <label htmlFor="name" className="form-label fw-semibold">
                      <i className="fas fa-user me-2 text-primary"></i>
                      Emri *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Shkruaj emrin"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="surname" className="form-label fw-semibold">
                      <i className="fas fa-user me-2 text-primary"></i>
                      Mbiemri *
                    </label>
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Shkruaj mbiemrin"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Rreshti 2: Username dhe Email */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      <i className="fas fa-at me-2 text-primary"></i>
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
                      <i className="fas fa-envelope me-2 text-primary"></i>
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

                {/* Rreshti 3: Specializimi dhe Eksperienca */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="specialization" className="form-label fw-semibold">
                      <i className="fas fa-graduation-cap me-2 text-primary"></i>
                      Specializimi *
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      className="form-select form-select-lg"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh specializimin</option>
                      <option value="Psikologji Klinike">Psikologji Klinike</option>
                      <option value="Psikologji Shkollore">Psikologji Shkollore</option>
                      <option value="Psikoterapi">Psikoterapi</option>
                      <option value="Neuropsikologji">Neuropsikologji</option>
                      <option value="Psikologji e Punës">Psikologji e Punës</option>
                      <option value="Këshillim Familjar">Këshillim Familjar</option>
                      <option value="Traumë dhe Stres">Traumë dhe Stres</option>
                      <option value="Të tjera">Të tjera</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="experienceLevel" className="form-label fw-semibold">
                      <i className="fas fa-chart-line me-2 text-primary"></i>
                      Niveli i Eksperiencës *
                    </label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      className="form-select form-select-lg"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh nivelin</option>
                      <option value="Fillestar (0-2 vjet)">Fillestar (0-2 vjet)</option>
                      <option value="I Mesëm (3-5 vjet)">I Mesëm (3-5 vjet)</option>
                      <option value="I Përvojshëm (6-10 vjet)">I Përvojshëm (6-10 vjet)</option>
                      <option value="Ekspert (10+ vjet)">Ekspert (10+ vjet)</option>
                    </select>
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

export default EditPsikologinForm;