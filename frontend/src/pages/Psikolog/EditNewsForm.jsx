import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getNewsById, updateNews } from "../../services/newsService";
import { Link } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import axios from "axios";

function EditNewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const [formData, setFormData] = useState({
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [psikologInfo, setPsikologInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        console.log(`🔍 Duke kërkuar news me ID: ${id}`);
        
        // Merr të dhënat e news
        const response = await getNewsById(id);
        console.log("✅ Përgjigja nga serveri:", response.data);
        
        setNews(response.data);
        setFormData({
          description: response.data.description || "",
        });
        
        if (response.data.imageUrl) {
          setCurrentImageUrl(response.data.imageUrl);
          setImagePreview(response.data.imageUrl);
        }

        // Merr të dhënat e psikologit
        const userId = localStorage.getItem("userId");
        if (userId) {
          const psikologRes = await axios.get(`https://localhost:7062/api/Psikolog/user/${userId}`, {
            withCredentials: true,
          });
          setPsikologInfo(psikologRes.data);
        }
      } catch (error) {
        console.error("❌ Gabim gjatë marrjes së news:", error);
        
        if (error.response) {
          console.error("📋 Response data:", error.response.data);
          console.error("🔢 Status code:", error.response.status);
          toast.error(`Server Error: ${error.response.data}`);
        } else {
          toast.error("Gabim gjatë marrjes së të dhënave të news");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

    setLoading(true);

    try {
      console.log(`📤 Duke përditësuar news ${id} me të dhënat:`, formData);
      
      // Krijo FormData për të dërguar file dhe të dhëna
      const formDataToSend = new FormData();
      formDataToSend.append("Description", formData.description);
      
      // Shto foto vetëm nëse ka ndryshuar
      if (imageFile) {
        formDataToSend.append("Image", imageFile);
      }
      
      await updateNews(id, formDataToSend);
      
      toast.success("News u përditësua me sukses!");
      
      setTimeout(() => {
        navigate("/menaxhoNews");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Gabim gjatë përditësimit:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.[0] || 
                           error.response.data ||
                           "Gabim gjatë përditësimit të news!";
        toast.error(errorMessage);
      } else {
        toast.error("Gabim gjatë përditësimit të news!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/menaxhoNews");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setCurrentImageUrl("");
  };

  if (fetchLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Duke ngarkuar...</span>
        </div>
        <span className="ms-2">Duke ngarkuar news...</span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>News nuk u gjet!</h4>
          <p>News me ID {id} nuk ekziston ose nuk keni qasje.</p>
          <button onClick={handleGoBack} className="btn btn-primary">
            Kthehu te Lista
          </button>
        </div>
      </div>
    );
  }

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

        {/* News Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>📰 News</small>
          </div>
          <Link to="/add-news" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto News
          </Link>
          <Link to="/menaxhoNews" className="nav-link text-white px-3 py-2 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px'}}>
            📋 Menaxho News
          </Link>
        </div>

        {/* Pacientët Section */}
        <div className="mb-3">
          <div className="text-white mb-2 px-2 py-1">
            <small className="text-uppercase fw-semibold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>📖 Pacientët</small>
          </div>
          <Link to="/menaxhoRaportet" className="nav-link text-white px-3 py-2 mb-1">
            👨‍⚕️ Menaxho Raportet
          </Link>
          <Link to="/add-raportin" className="nav-link text-white px-3 py-2 mb-1">
            ➕ Shto Raport
          </Link>
        </div>
        
        <div className="mt-auto">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={handleGoBack} className="btn btn-secondary w-100">
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
                <div className="card-header bg-warning text-dark py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-edit me-2"></i>
                      Përditëso News
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
                  {/* Informacion për news */}
                  <div className="alert alert-info mb-4">
                    <h6 className="alert-heading">Informacion për News:</h6>
                    <div className="row small">
                      <div className="col-md-6">
                        <strong>ID e News:</strong> {id}
                      </div>
                      <div className="col-md-6">
                        <strong>Data e krijimit:</strong> {new Date(news.createdAt).toLocaleDateString('sq-AL')}
                      </div>
                      {news.updatedAt && (
                        <div className="col-md-6">
                          <strong>Përditësuar më:</strong> {new Date(news.updatedAt).toLocaleDateString('sq-AL')}
                        </div>
                      )}
                      <div className="col-md-6">
                        <strong>Psikologu:</strong> {news.psikologName || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Informacion i psikologit */}
                  {psikologInfo && (
                    <div className="alert alert-primary mb-4">
                      <h6 className="alert-heading mb-2">
                        <i className="fas fa-user-md me-2"></i>
                        Ju jeni duke modifikuar si:
                      </h6>
                      <div className="small">
                        <strong>Emri:</strong> {psikologInfo.emri} {psikologInfo.mbiemri}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Fotoja aktuale dhe upload */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-image me-2 text-warning"></i>
                        Fotoja e News
                      </label>
                      
                      <div className="border rounded p-3">
                        <div className="row">
                          {/* Fotoja aktuale */}
                          <div className="col-md-6 mb-3">
                            <h6 className="text-center mb-2">Fotoja Aktuale</h6>
                            {currentImageUrl ? (
                              <div className="text-center">
                                <img 
                                  src={currentImageUrl} 
                                  alt="Current" 
                                  className="img-fluid rounded mb-2"
                                  style={{ maxHeight: "150px", maxWidth: "100%" }}
                                />
                                <small className="text-muted d-block">
                                  Foto aktuale
                                </small>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <i className="fas fa-image fa-2x text-muted mb-2"></i>
                                <p className="text-muted mb-0">Nuk ka foto të ngarkuar</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Preview i fotos së re */}
                          <div className="col-md-6 mb-3">
                            <h6 className="text-center mb-2">Fotoja e Re</h6>
                            {imagePreview && imagePreview !== currentImageUrl ? (
                              <div className="text-center">
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="img-fluid rounded mb-2"
                                  style={{ maxHeight: "150px", maxWidth: "100%" }}
                                />
                                <small className="text-success d-block">
                                  <i className="fas fa-check-circle me-1"></i>
                                  Foto e re e zgjedhur
                                </small>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <i className="fas fa-plus-circle fa-2x text-muted mb-2"></i>
                                <p className="text-muted mb-0">Zgjidh foto të re</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-center gap-2 mt-3">
                          <div>
                            <input
                              type="file"
                              id="imageUpload"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="form-control"
                              style={{ display: "none" }}
                            />
                            <label htmlFor="imageUpload" className="btn btn-outline-warning">
                              <i className="fas fa-upload me-1"></i>
                              Zgjidh Foto të Re
                            </label>
                          </div>
                          
                          {imagePreview && imagePreview !== currentImageUrl && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={removeImage}
                            >
                              <i className="fas fa-times me-1"></i>
                              Hiq Foto të Re
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="form-text">
                        Lëreni bosh për të mbajtur foton aktuale, ose zgjidhni një të re (max 5MB).
                      </div>
                    </div>

                    {/* Përshkrimi */}
                    <div className="mb-4">
                      <label htmlFor="description" className="form-label fw-semibold">
                        <i className="fas fa-align-left me-2 text-warning"></i>
                        Përshkrimi i News *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control form-control-lg"
                        rows="6"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
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
                            Duke përditësuar...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Ruaj Ndryshimet
                          </>
                        )}
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

export default EditNewsForm;