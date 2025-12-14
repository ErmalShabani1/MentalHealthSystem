import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllNews } from "../../services/newsService";
import { logoutUser } from "../../services/authService";

function NewsList() {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    // Merr rolin e përdoruesit
    const role = localStorage.getItem("userRole") || "";
    setUserRole(role);

    // Merr të gjitha news
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getAllNews();
      console.log("📰 Të gjitha news:", response.data);
      setNewsList(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së news:", error);
      toast.error("Gabim gjatë ngarkimit të lajmeve");
    } finally {
      setLoading(false);
    }
  };

  // Funksioni për të marrë URL të plotë të imazhit
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Nëse URL ka tashmë http/https, ktheje ashtu siç është
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Nëse fillon me /, shto base URL të backend
    if (imageUrl.startsWith('/')) {
      return `https://localhost:7062${imageUrl}`;
    }
    
    // Fallback
    return `https://localhost:7062/newsImages/${imageUrl}`;
  };

  // Funksioni për të formatuar datën
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Funksioni për të shkurtuar përshkrimin
  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Komponent për imazh me error handling
  const NewsImage = ({ news }) => {
    const [imgSrc, setImgSrc] = useState(getFullImageUrl(news.imageUrl));
    const [hasError, setHasError] = useState(false);

    const handleImageError = () => {
      console.error(`❌ HTTPS failed for news ${news.id}, trying HTTP...`);
      
      // Provoni me HTTP
      const httpUrl = imgSrc.replace('https://', 'http://');
      setImgSrc(httpUrl);
      
      // Nëse HTTP dështon, shfaq fallback
      const testImg = new Image();
      testImg.onerror = () => {
        console.error(`❌ HTTP also failed for news ${news.id}`);
        setHasError(true);
      };
      testImg.src = httpUrl;
    };

    if (hasError || !news.imageUrl) {
      return (
        <div className="card-img-top bg-light d-flex align-items-center justify-content-center"
             style={{ height: "200px" }}>
          <i className="fas fa-image fa-3x text-muted"></i>
          <small className="text-muted mt-2">Nuk ka foto</small>
        </div>
      );
    }

    return (
      <img 
        src={imgSrc}
        className="card-img-top"
        alt="News"
        style={{ 
          height: "200px", 
          objectFit: "cover",
          borderTopLeftRadius: "calc(0.375rem - 1px)",
          borderTopRightRadius: "calc(0.375rem - 1px)"
        }}
        crossOrigin="anonymous"
        onError={handleImageError}
        onLoad={() => console.log(`✅ Imazhi u ngarkua: ${news.id}`)}
      />
    );
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar - Ndryshon sipas rolit */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "250px", position: "fixed", height: "100vh" }}
      >
        <h4 className="text-center mb-4">Lajmet</h4>
        
        {userRole === "Pacient" && (
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/pacientDashboard" className="nav-link text-white">
                🏠 Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/news" className="nav-link text-white active">
                📰 Lajmet
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/shfaqRaportet" className="nav-link text-white">
                📊 Raportet e Mia
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/shfaqTakimet" className="nav-link text-white">
                📅 Takimet e Mia
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/shfaqPsikologet" className="nav-link text-white">
                👨‍⚕️ Psikologët
              </Link>
            </li>
          </ul>
        )}

        {userRole === "Psikolog" && (
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/psikologDashboard" className="nav-link text-white">
                🏠 Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/news" className="nav-link text-white active">
                📰 Lajmet
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/menaxhoNews" className="nav-link text-white">
                📋 Menaxho News
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/menaxhoRaportet" className="nav-link text-white">
                👨‍⚕️ Menaxho Raportet
              </Link>
            </li>
          </ul>
        )}

        {userRole === "Admin" && (
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/adminDashboard" className="nav-link text-white">
                🏠 Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/news" className="nav-link text-white active">
                📰 Lajmet
              </Link>
            </li>
          </ul>
        )}

        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={() => navigate('/pacientDashboard')} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Lajmet e Fundit</h2>
              <p className="text-muted mb-0">Ndiqni lajmet më të fundit nga psikologët tanë</p>
            </div>
            <div className="text-muted">
              {new Date().toLocaleDateString('sq-AL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Butoni për psikologët për të shtuar news */}
          {userRole === "Psikolog" && (
            <div className="mb-4">
              <Link to="/add-news" className="btn btn-info">
                <i className="fas fa-plus me-2"></i>
                Shto News të Ri
              </Link>
            </div>
          )}

          {/* Debug info */}
          <div className="alert alert-info mb-3">
            <small>
              <strong>Informacion debug:</strong>
              <div className="mt-1">
                <span className="badge bg-secondary me-1">Total News: {newsList.length}</span>
                <span className="badge bg-info me-1">
                  Me Foto: {newsList.filter(n => n.imageUrl).length}
                </span>
                <button 
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => {
                    newsList.forEach(news => {
                      console.log(`News ${news.id}:`, {
                        imageUrl: news.imageUrl,
                        fullUrl: getFullImageUrl(news.imageUrl),
                        backendUrl: `https://localhost:7062${news.imageUrl}`
                      });
                    });
                  }}
                >
                  Log URL Details
                </button>
              </div>
            </small>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Duke ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar lajmet...</p>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">Nuk ka lajme</h4>
              <p className="text-muted mb-4">Nuk ka lajme të publikuara akoma.</p>
              {userRole === "Psikolog" && (
                <Link to="/add-news" className="btn btn-info">
                  <i className="fas fa-plus me-2"></i>
                  Bëhu i pari që publikon
                </Link>
              )}
            </div>
          ) : (
            <div className="row">
              {newsList.map((news) => (
                <div key={news.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    {/* Fotoja me komponentin e ri */}
                    <NewsImage news={news} />
                    
                    <div className="card-body d-flex flex-column">
                      {/* Meta info */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          <i className="fas fa-calendar-alt me-1"></i>
                          {formatDate(news.createdAt)}
                        </small>
                        <span className="badge bg-info">
                          <i className="fas fa-user-md me-1"></i>
                          {news.psikologName}
                        </span>
                      </div>

                      {/* Përshkrimi */}
                      <p className="card-text flex-grow-1">
                        {truncateDescription(news.description, 120)}
                      </p>

                      {/* Data e përditësimit nëse ka */}
                      {news.updatedAt && news.updatedAt !== news.createdAt && (
                        <small className="text-info mb-2">
                          <i className="fas fa-edit me-1"></i>
                          Përditësuar: {formatDate(news.updatedAt)}
                        </small>
                      )}

                      {/* Butoni për të parë më shumë */}
                      <div className="mt-auto">
                        <button 
                          className="btn btn-outline-info btn-sm w-100"
                          onClick={() => {
                            // Mund të implementohet modal për të parë të plotë
                            alert(news.description);
                          }}
                        >
                          <i className="fas fa-eye me-1"></i>
                          Shiko më shumë
                        </button>
                        
                        {/* Debug link - mund të hiqet më vonë */}
                        <small className="d-block text-center mt-1">
                          <a 
                            href={getFullImageUrl(news.imageUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(getFullImageUrl(news.imageUrl), '_blank');
                            }}
                          >
                            <small>Open image</small>
                          </a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistikë */}
          {!loading && newsList.length > 0 && (
            <div className="mt-4 pt-3 border-top">
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-white rounded shadow-sm">
                    <h4 className="text-info">{newsList.length}</h4>
                    <small className="text-muted">Lajme Totale</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-white rounded shadow-sm">
                    <h4 className="text-success">
                      {newsList.filter(n => {
                        const newsDate = new Date(n.createdAt);
                        const today = new Date();
                        return newsDate.toDateString() === today.toDateString();
                      }).length}
                    </h4>
                    <small className="text-muted">Sot</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-white rounded shadow-sm">
                    <h4 className="text-warning">
                      {new Set(newsList.map(n => n.psikologId || n.psikologName)).size}
                    </h4>
                    <small className="text-muted">Psikologë Aktivë</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsList;