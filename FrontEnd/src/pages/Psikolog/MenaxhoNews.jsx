import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteNews, getMyNews } from "../../services/newsService";
import PsikologSidePanel from "./PsikologSidePanel";

function MenaxhoNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "https://localhost:7062";

  useEffect(() => {
    fetchMyNews();
  }, []);

  

 const fetchMyNews = async () => {
  try {
    const response = await getMyNews();
    setNewsList(response.data || []);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë news?")) {
      try {
        await deleteNews(id);
        toast.success("News u fshi me sukses!");
          fetchMyNews();
      } catch (error) {
        toast.error("Gabim gjatë fshirjes së news!");
      }
    }
  };

  // Llogarit statistikat
  const stats = {
    total: newsList.length,
    thisMonth: newsList.filter(n => {
      const newsDate = new Date(n.createdAt);
      const now = new Date();
      return newsDate.getMonth() === now.getMonth() && 
             newsDate.getFullYear() === now.getFullYear();
    }).length,
   hasImage: newsList.filter(n => n.imageUrl?.trim()).length,
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <PsikologSidePanel section="news" activePath="/menaxhoNews" />

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          {/* Header dhe Statistikat */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Menaxho News</h2>
              <p className="text-muted mb-0">Menaxho të gjitha news e publikuar</p>
            </div>
            <Link to="/add-news" className="btn btn-info">
              <i className="fas fa-plus me-2"></i>
              News i Ri
            </Link>
          </div>

          {/* Statistikat e shpejta */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{stats.total}</h4>
                      <small>Total News</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-newspaper fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{stats.thisMonth}</h4>
                      <small>Këtë Muaj</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-calendar-alt fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{stats.hasImage}</h4>
                      <small>Me Foto</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-image fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-purple text-white" style={{backgroundColor: '#6f42c1'}}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{newsList.filter(n => n.updatedAt).length}</h4>
                      <small>Përditësuar</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-edit fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela e News */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Lista e News ({newsList.length})</h5>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Duke ngarkuar...</span>
                  </div>
                  <p className="mt-2">Duke ngarkuar news...</p>
                </div>
              ) : newsList.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Nuk keni news</h5>
                  <p className="text-muted">Shtoni news-in tuaj të parë duke klikuar butonin "News i Ri"</p>
                  <Link to="/add-news" className="btn btn-info">
                    <i className="fas fa-plus me-2"></i>
                    Shto News të Ri
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th width="100">Foto</th>
                        <th>Përshkrimi</th>
                        <th>Data</th>
                        <th className="text-center" width="200">Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsList.map((news) => (
                        <tr key={news.id}>
                          <td>
                            {news.imageUrl ? (
  <img
    src={
      news.imageUrl.startsWith("http")
        ? news.imageUrl
        : `${API_BASE_URL}${news.imageUrl}`
    }
    alt="News"
    className="img-thumbnail"
    style={{ width: "80px", height: "80px", objectFit: "cover" }}
    onError={(e) => {
      e.target.src = "/no-image.png"; // opsionale
    }}
  />
) : (
                              <div className="img-thumbnail d-flex align-items-center justify-content-center"
                                   style={{ width: "80px", height: "80px", backgroundColor: "#f8f9fa" }}>
                                <i className="fas fa-image text-muted"></i>
                              </div>
                            )}
                          </td>
                          <td>
                            <div>
                              <div className="fw-bold text-truncate" style={{maxWidth: '400px'}}>
                                {news.description}
                              </div>
                              <small className="text-muted">
                                Publikuar nga: {news.psikologName || "Psikologu"}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{new Date(news.createdAt).toLocaleDateString('sq-AL')}</div>
                              <small className="text-muted">
                                {news.updatedAt && news.updatedAt !== news.createdAt ? (
                                  <span className="text-info">
                                    Përditësuar: {new Date(news.updatedAt).toLocaleDateString('sq-AL')}
                                  </span>
                                ) : (
                                  <span className="text-success">
                                    E re
                                  </span>
                                )}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/edit-news/${news.id}`}
                                className="btn btn-sm btn-outline-info"
                              >
                                <i className="fas fa-edit me-1"></i>
                                Modifiko
                              </Link>
                              
                              <button
                                onClick={() => handleDelete(news.id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                <i className="fas fa-trash me-1"></i>
                                Fshi
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenaxhoNews;