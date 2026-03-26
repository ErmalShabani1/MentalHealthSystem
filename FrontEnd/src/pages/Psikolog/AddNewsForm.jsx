import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createNews } from "../../services/newsService";
import axios from "axios";
import PsikologSidePanel from "./PsikologSidePanel";

function AddNewsForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [psikologInfo, setPsikologInfo] = useState(null);

 useEffect(() => {
  const fetchPsikologInfo = async () => {
    try {
      const token = localStorage.getItem("token"); // ose si e ruan ti JWT
      const response = await axios.get("https://localhost:7062/api/News/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPsikologInfo(response.data);
    } catch (error) {
      console.error("❌ Gabim gjatë marrjes së të dhënave të psikologit:", error);
    }
  };

  fetchPsikologInfo();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kontrollo madhësinë e file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imazhi duhet të jetë më i vogël se 5MB");
        return;
      }

      // Kontrollo llojin e file
      if (!file.type.match("image.*")) {
        toast.error("Ju lutemi zgjidhni një file imazhi");
        return;
      }

      setImageFile(file);

      // Krijo preview për imazhin
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!psikologInfo) {
      toast.error("Nuk u gjet informacioni i psikologit!");
      return;
    }

    if (!formData.description || formData.description.trim() === "") {
      toast.error("Përshkrimi është i detyrueshëm!");
      return;
    }

    if (!imageFile) {
      toast.error("Ju lutemi zgjidhni një foto!");
      return;
    }

    setLoading(true);

    try {
      // Krijo FormData për të dërguar file dhe të dhëna
      const formDataToSend = new FormData();
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Image", imageFile);
      formDataToSend.append("PsikologId", psikologInfo.id);

      console.log("📤 Duke dërguar të dhënat për news...");

      const result = await createNews(formDataToSend);
      console.log("✅ Përgjigja nga serveri:", result);
      
      toast.success("News u shtua me sukses!");
      
      // Reset form data
      setFormData({
        description: "",
      });
      setImageFile(null);
      setImagePreview(null);
      
      // Navigo pas 1.5 sekondash
      setTimeout(() => {
        navigate("/menaxhoNews");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Gabim i detajuar:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response) {
        let errorMessage = "Gabim gjatë shtimit të news!";
        
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(', ');
        }
        
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
    navigate("/menaxhoNews");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <PsikologSidePanel section="news" activePath="/add-news" />

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div className="card shadow border-0">
                <div className="card-header bg-info text-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-newspaper me-2"></i>
                      Shto News të Ri
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
                  {/* Informacion i psikologit */}
                  {psikologInfo && (
                    <div className="alert alert-primary mb-4">
                      <h6 className="alert-heading mb-2">
                        <i className="fas fa-user-md me-2"></i>
                        Informacioni i Psikologit
                      </h6>
                      <div className="row small">
                        <div className="col-md-6">
                          <strong>Emri:</strong> {psikologInfo.emri} {psikologInfo.mbiemri}
                        </div>
                        <div className="col-md-6">
                          <strong>ID:</strong> {psikologInfo.id}
                        </div>
                      </div>
                      <small className="text-muted d-block mt-2">
                        News-i do të publikohëm me emrin tuaj.
                      </small>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Upload Foto */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-image me-2 text-info"></i>
                        Fotoja e News *
                      </label>
                      
                      <div className="border rounded p-3 text-center">
                        {imagePreview ? (
                          <div className="mb-3">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="img-fluid rounded"
                              style={{ maxHeight: "200px", maxWidth: "100%" }}
                            />
                          </div>
                        ) : (
                          <div className="py-4">
                            <i className="fas fa-image fa-3x text-muted mb-3"></i>
                            <p className="text-muted mb-0">Nuk ka foto të zgjedhur</p>
                          </div>
                        )}
                        
                        <div className="d-flex justify-content-center gap-2">
                          <div>
                            <input
                              type="file"
                              id="imageUpload"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="form-control"
                              style={{ display: "none" }}
                            />
                            <label htmlFor="imageUpload" className="btn btn-outline-info">
                              <i className="fas fa-upload me-1"></i>
                              Zgjidh Foto
                            </label>
                          </div>
                          
                          {imagePreview && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                            >
                              <i className="fas fa-trash me-1"></i>
                              Hiq Foto
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="form-text">
                        Ngarko një foto për news (max 5MB). Formatet e lejuara: JPG, PNG, GIF.
                      </div>
                    </div>

                    {/* Përshkrimi */}
                    <div className="mb-4">
                      <label htmlFor="description" className="form-label fw-semibold">
                        <i className="fas fa-align-left me-2 text-info"></i>
                        Përshkrimi i News *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control form-control-lg"
                        placeholder="Shkruani përshkrimin e news-it..."
                        rows="6"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                      <div className="form-text">
                        Shkruani përshkrimin e plotë të news-it që doni të publikoni.
                      </div>
                    </div>

                    {/* Informacion shtesë */}
                    <div className="alert alert-warning">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      <strong>Kujdes:</strong> News-i do të jetë publik dhe i dukshëm për të gjithë pacientët në sistem.
                      Kontrolloni që të gjitha informacionet janë të sakta para publikimit.
                    </div>

                    {/* Butonat */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                     <button 
  type="button"
  onClick={handleGoBack}
  className="btn btn-outline-secondary btn-lg"
>
  <i className="fas fa-arrow-left me-2"></i>
  Anulo
</button>

<button 
  type="submit" 
  className="btn btn-info btn-lg"
  disabled={loading}
>
  {loading ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
      Duke publikuar...
    </>
  ) : (
    <>
      <i className="fas fa-paper-plane me-2"></i>
      Publiko News
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

export default AddNewsForm;