import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllNews } from "../../services/newsService";

function PatientNewsSection() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageStatus, setImageStatus] = useState({});

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await getAllNews();
      const latestNews = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setNewsList(latestNews);
    } catch (error) {
      console.error("Gabim gjatë marrjes së lajmeve:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', {
      day: 'numeric',
      month: 'short'
    });
  };

  const truncateDescription = (text, maxLength = 60) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Komponent për imazh me kontroll të plotë
  const NewsImage = ({ news }) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (news.imageUrl) {
        const fullUrl = `https://localhost:7062${news.imageUrl}`;
        console.log(`🖼️ Duke ngarkuar imazhin për news ${news.id}: ${fullUrl}`);
        
        // Krijo një Image objekt për të testuar
        const testImage = new Image();
        testImage.crossOrigin = "anonymous"; // Kjo është e rëndësishme për CORS
        
        testImage.onload = () => {
          console.log(`✅ Imazhi u ngarkua me sukses: ${fullUrl}`);
          setImgSrc(fullUrl);
          setIsLoading(false);
          setImageStatus(prev => ({ ...prev, [news.id]: 'loaded' }));
        };
        
        testImage.onerror = (error) => {
          console.error(`❌ Gabim gjatë ngarkimit të imazhit:`, {
            url: fullUrl,
            newsId: news.id,
            error: error
          });
          
          // Provoni pa HTTPS
          const httpUrl = fullUrl.replace('https://', 'http://');
          console.log(`🔄 Duke provuar URL alternative: ${httpUrl}`);
          
          const fallbackImage = new Image();
          fallbackImage.crossOrigin = "anonymous";
          
          fallbackImage.onload = () => {
            console.log(`✅ U ngarkua me HTTP: ${httpUrl}`);
            setImgSrc(httpUrl);
            setIsLoading(false);
          };
          
          fallbackImage.onerror = () => {
            console.error(`❌ Të dyja URL-të dështuan`);
            setHasError(true);
            setIsLoading(false);
            setImageStatus(prev => ({ ...prev, [news.id]: 'error' }));
          };
          
          fallbackImage.src = httpUrl;
        };
        
        testImage.src = fullUrl;
      } else {
        setIsLoading(false);
        setHasError(true);
      }
    }, [news.imageUrl, news.id]);

    if (isLoading) {
      return (
        <div className="rounded bg-light d-flex align-items-center justify-content-center"
             style={{ width: "60px", height: "60px" }}>
          <div className="spinner-border spinner-border-sm text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (hasError || !imgSrc) {
      return (
        <div className="rounded bg-light d-flex align-items-center justify-content-center"
             style={{ width: "60px", height: "60px" }}>
          <i className="fas fa-image text-muted"></i>
        </div>
      );
    }

    return (
      <img 
        src={imgSrc}
        alt="News"
        className="rounded"
        style={{ 
          width: "60px", 
          height: "60px", 
          objectFit: "cover",
          border: "2px solid #28a745" // Kufi jeshil për të treguar që funksionon
        }}
        crossOrigin="anonymous" // Kjo është kritike për CORS
      />
    );
  };

  if (loading) {
    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">📰 Lajmet e Fundit</h5>
          </div>
          <div className="card-body text-center py-4">
            <div className="spinner-border spinner-border-sm text-info" role="status"></div>
            <p className="mt-2 mb-0">Duke ngarkuar lajmet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (newsList.length === 0) {
    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📰 Lajmet e Fundit</h5>
            <Link to="/news" className="btn btn-sm btn-outline-info">
              Shiko të Gjitha
            </Link>
          </div>
          <div className="card-body text-center py-4">
            <i className="fas fa-newspaper fa-2x text-muted mb-3"></i>
            <p className="text-muted mb-0">Nuk ka lajme të reja</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-6 mb-4">
      {/* Debug info */}
      <div className="alert alert-info alert-sm mb-2">
        <small>
          <strong>Statusi i imazheve:</strong>
          <div className="mt-1">
            {newsList.map(news => (
              <span key={news.id} className={`badge me-1 ${imageStatus[news.id] === 'loaded' ? 'bg-success' : imageStatus[news.id] === 'error' ? 'bg-danger' : 'bg-warning'}`}>
                {news.id}: {imageStatus[news.id] || 'loading'}
              </span>
            ))}
          </div>
        </small>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📰 Lajmet e Fundit</h5>
          <Link to="/news" className="btn btn-sm btn-outline-info">
            Shiko të Gjitha
          </Link>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {newsList.map((news) => (
              <div key={news.id} className="list-group-item">
                <div className="d-flex">
                  {/* Fotoja me komponentin e ri */}
                  <div className="flex-shrink-0 me-3">
                    <NewsImage news={news} />
                  </div>
                  
                  {/* Përmbajtja */}
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1 fw-bold">{truncateDescription(news.description, 50)}</h6>
                        <small className="text-muted">
                          <i className="fas fa-user-md me-1"></i>
                          {news.psikologName}
                        </small>
                        {/* Debug link */}
                        <small className="d-block">
                          <a 
                            href={`https://localhost:7062${news.imageUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`https://localhost:7062${news.imageUrl}`, '_blank');
                            }}
                          >
                            Testo imazhin →
                          </a>
                        </small>
                      </div>
                      <span className="badge bg-light text-dark">
                        {formatDate(news.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientNewsSection;