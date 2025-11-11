import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Shto këtë import

const API_URL = "https://localhost:7062/api/Psikologi/add";

function AddPsikologinForm() {
  const navigate = useNavigate(); // Shto këtë
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    specialization: "",
    experienceLevel: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(API_URL, formData, { withCredentials: true });
      toast.success("Psikologu u shtua me sukses!");
      
      // Navigo direkt në adminDashboard pas 1.5 sekondash
      setTimeout(() => {
        navigate("/adminDashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Gabim:", error);
      toast.error(error.response?.data || "Gabim gjatë shtimit të psikologut!");
    } finally {
      setLoading(false);
    }
  };

  // Butoni për tu kthyer në dashboard pa pritur
  const handleGoBack = () => {
    navigate("/adminDashboard");
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-user-md me-2"></i>
                  Shto Psikolog të Ri
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

                {/* Rreshti 3: Fjalëkalimi */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="fas fa-lock me-2 text-primary"></i>
                    Fjalëkalimi *
                  </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Fjalëkalimi i ri"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  <div className="form-text">
                    Fjalëkalimi duhet të jetë të paktën 6 karaktere.
                  </div>
                </div>

                {/* Rreshti 4: Specializimi dhe Eksperienca */}
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

                {/* Butonat */}
                <div className="d-grid gap-2 d-md-flex justify-content-between mt-4">
                  <button 
                    type="button"
                    onClick={handleGoBack}
                    className="btn btn-outline-secondary btn-lg py-3 fw-semibold order-md-1"
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Kthehu në Dashboard
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg py-3 fw-semibold order-md-2 flex-grow-1 ms-md-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Duke shtuar...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus-circle me-2"></i>
                        Shto Psikologun
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

export default AddPsikologinForm;