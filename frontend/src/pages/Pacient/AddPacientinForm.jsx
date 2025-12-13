import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = "https://localhost:7062/api/Patient/add";

function AddPacientinForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    emri: "",
    mbiemri: "",
    mosha: "",
    gjinia: "",
    diagnoza: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};
const navigateByRole = () => {
  const role = getCookie("role");

  if (role === "Admin") {
    navigate("/adminDashboard");
  } else  {
    navigate("/psikologDashboard");
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(API_URL, formData, { withCredentials: true });
      toast.success("Pacienti u shtua me sukses!");
      
      // Navigo direkt në adminDashboard pas 1.5 sekondash
      setTimeout(() => {
        navigateByRole();
      }, 1500);
      
    } catch (error) {
      console.error("Gabim:", error);
      toast.error(error.response?.data || "Gabim gjatë shtimit të pacientit!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigateByRole();
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-header bg-success text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-user-plus me-2"></i>
                  Shto Pacient të Ri
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

                {/* Rreshti 3: Fjalëkalimi */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="fas fa-lock me-2 text-success"></i>
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
                    minLength="6"
                  />
                  <div className="form-text">
                    Fjalëkalimi duhet të jetë të paktën 6 karaktere.
                  </div>
                </div>

                {/* Rreshti 4: Mosha dhe Gjinia */}
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

                {/* Rreshti 5: Diagnoza */}
                <div className="mb-3">
                  <label htmlFor="diagnoza" className="form-label fw-semibold">
                    <i className="fas fa-file-medical me-2 text-success"></i>
                    Diagnoza Fillestare
                  </label>
                  <select
                    id="diagnoza"
                    name="diagnoza"
                    className="form-select form-select-lg"
                    value={formData.diagnoza}
                    onChange={handleChange}
                  >
                    <option value="">Zgjidh diagnozën fillestare (opsionale)</option>
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
                  </select>
                  <div className="form-text">
                    Kjo diagnozë mund të përditësohet më vonë nga psikologu.
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
                    className="btn btn-success btn-lg py-3 fw-semibold order-md-2 flex-grow-1 ms-md-2"
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
                        Shto Pacientin
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

export default AddPacientinForm;