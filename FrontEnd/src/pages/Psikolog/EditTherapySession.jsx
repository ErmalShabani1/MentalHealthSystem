import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getTherapySessionById, updateTherapySession } from "../../services/TherapySessionService";
import { Link } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function EditTherapySession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const [formData, setFormData] = useState({
    sessionDate: "",
    durationMinutes: 60,
    notes: "",
    moodAfter: "",
    goals: "",
    exercises: "",
    moodBefore: "",
    status: "Scheduled"
  });

  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setFetchLoading(true);
        console.log(`🔍 Duke kërkuar seancën me ID: ${id}`);
        
        const response = await getTherapySessionById(id);
        console.log("✅ Përgjigja nga serveri:", response.data);
        
        setSession(response.data);
        setFormData({
          sessionDate: new Date(response.data.sessionDate).toISOString().slice(0, 16),
          durationMinutes: response.data.durationMinutes || 60,
          notes: response.data.notes || "",
          moodAfter: response.data.moodAfter || "",
          goals: response.data.goals || "",
          exercises: response.data.exercises || "",
          moodBefore: response.data.moodBefore || "",
          status: response.data.status || "Scheduled"
        });
      } catch (error) {
        console.error("❌ Gabim gjatë marrjes së seancës:", error);
        
        if (error.response) {
          console.error("📋 Response data:", error.response.data);
          console.error("🔢 Status code:", error.response.status);
          toast.error(`Server Error: ${error.response.data}`);
        } else {
          toast.error("Gabim gjatë marrjes së të dhënave të seancës");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sessionDate) {
      toast.error("Data dhe koha e seancës është e detyrueshme!");
      return;
    }

    if (!formData.durationMinutes || formData.durationMinutes < 15 || formData.durationMinutes > 300) {
      toast.error("Kohëzgjatja duhet të jetë midis 15 dhe 300 minutave!");
      return;
    }

    setLoading(true);

    try {
      console.log(`📤 Duke përditësuar seancën ${id} me të dhënat:`, formData);
      
      const updateData = {
        id: parseInt(id),
        sessionDate: new Date(formData.sessionDate).toISOString(),
        durationMinutes: parseInt(formData.durationMinutes),
        notes: formData.notes,
        moodAfter: formData.moodAfter,
        goals: formData.goals,
        exercises: formData.exercises,
        moodBefore: formData.moodBefore,
        status: formData.status
      };

      await updateTherapySession(id, updateData);
      
      toast.success("Seanca u përditësua me sukses!");
      
      setTimeout(() => {
        navigate("/menaxhoTerapine");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Gabim gjatë përditësimit:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.[0] || 
                           error.response.data ||
                           "Gabim gjatë përditësimit të seancës!";
        toast.error(errorMessage);
      } else {
        toast.error("Gabim gjatë përditësimit të seancës!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/menaxhoSeancat");
  };

  if (fetchLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Duke ngarkuar...</span>
        </div>
        <span className="ms-2">Duke ngarkuar seancën...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Seanca nuk u gjet!</h4>
          <p>Seanca me ID {id} nuk ekziston ose nuk keni qasje.</p>
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
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh", overflowY: "auto" }}
      >
        <h4 className="mb-4 text-center">Psikolog Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/psikologDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/add-seancen" className="nav-link text-white">
              📝 Shto Seancë
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoSeancat" className="nav-link text-white active">
              📊 Menaxho Seancat
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoTakimet" className="nav-link text-white">
              📋 Menaxho Takimet
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/pacientetEMi" className="nav-link text-white">
              👥 Pacientët e Mi
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={() => navigate('/psikologDashboard')} className="btn btn-secondary w-100">
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
                <div className="card-header bg-primary text-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                      <i className="fas fa-edit me-2"></i>
                      Përditëso Seancën Terapeutike
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
                  {/* Informacion për seancën */}
                  <div className="alert alert-info mb-4">
                    <h6 className="alert-heading">Informacion për Seancën:</h6>
                    <div className="row small">
                      <div className="col-md-6">
                        <strong>Pacienti:</strong> {session.patientName}
                      </div>
                      <div className="col-md-6">
                        <strong>Psikologu:</strong> {session.psikologName}
                      </div>
                      <div className="col-md-6">
                        <strong>Numri i Seancës:</strong> {session.sessionNumber}
                      </div>
                      <div className="col-md-6">
                        <strong>Data e krijimit:</strong> {new Date(session.createdAt).toLocaleDateString('sq-AL')}
                      </div>
                      <div className="col-md-6">
                        <strong>ID e Seancës:</strong> {id}
                      </div>
                      {session.updatedAt && (
                        <div className="col-md-6">
                          <strong>Përditësuar më:</strong> {new Date(session.updatedAt).toLocaleDateString('sq-AL')}
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      {/* Data dhe Koha */}
                      <div className="col-md-6 mb-4">
                        <label htmlFor="sessionDate" className="form-label fw-semibold">
                          <i className="fas fa-calendar-alt me-2 text-primary"></i>
                          Data dhe Koha e Seancës *
                        </label>
                        <input
                          id="sessionDate"
                          name="sessionDate"
                          type="datetime-local"
                          className="form-control form-control-lg"
                          value={formData.sessionDate}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Kohëzgjatja */}
                      <div className="col-md-6 mb-4">
                        <label htmlFor="durationMinutes" className="form-label fw-semibold">
                          <i className="fas fa-clock me-2 text-primary"></i>
                          Kohëzgjatja (minuta) *
                        </label>
                        <input
                          id="durationMinutes"
                          name="durationMinutes"
                          type="number"
                          className="form-control form-control-lg"
                          value={formData.durationMinutes}
                          onChange={handleChange}
                          min="15"
                          max="300"
                          step="15"
                          required
                        />
                        <small className="text-muted">Min: 15 min, Max: 300 min, hapi: 15 min</small>
                      </div>
                    </div>

                    <div className="row">
                      {/* Gjendja Para */}
                      <div className="col-md-6 mb-4">
                        <label htmlFor="moodBefore" className="form-label fw-semibold">
                          <i className="fas fa-smile me-2 text-primary"></i>
                          Gjendja Para Seancës
                        </label>
                        <input
                          id="moodBefore"
                          name="moodBefore"
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.moodBefore}
                          onChange={handleChange}
                          maxLength="200"
                          placeholder="P.sh.: I stresuar, I qetë, I gëzuar..."
                        />
                      </div>

                      {/* Gjendja Pas */}
                      <div className="col-md-6 mb-4">
                        <label htmlFor="moodAfter" className="form-label fw-semibold">
                          <i className="fas fa-laugh me-2 text-primary"></i>
                          Gjendja Pas Seancës
                        </label>
                        <input
                          id="moodAfter"
                          name="moodAfter"
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.moodAfter}
                          onChange={handleChange}
                          maxLength="200"
                          placeholder="P.sh.: I relaksuar, I përmbledhur..."
                        />
                      </div>
                    </div>

                    {/* Statusi */}
                    <div className="mb-4">
                      <label htmlFor="status" className="form-label fw-semibold">
                        <i className="fas fa-info-circle me-2 text-primary"></i>
                        Statusi i Seancës
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="form-control form-control-lg"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Scheduled">E planifikuar</option>
                        <option value="Completed">E përfunduar</option>
                        <option value="Cancelled">E anuluar</option>
                        <option value="NoShow">Nuk u shfaq</option>
                      </select>
                    </div>

                    {/* Qëllimet */}
                    <div className="mb-4">
                      <label htmlFor="goals" className="form-label fw-semibold">
                        <i className="fas fa-bullseye me-2 text-primary"></i>
                        Qëllimet e Seancës
                      </label>
                      <textarea
                        id="goals"
                        name="goals"
                        className="form-control form-control-lg"
                        rows="3"
                        value={formData.goals}
                        onChange={handleChange}
                        maxLength="500"
                        placeholder="Qëllimet dhe objektivat për këtë seancë..."
                      />
                    </div>

                    {/* Ushtrimet */}
                    <div className="mb-4">
                      <label htmlFor="exercises" className="form-label fw-semibold">
                        <i className="fas fa-running me-2 text-primary"></i>
                        Ushtrimet e Dhëna
                      </label>
                      <textarea
                        id="exercises"
                        name="exercises"
                        className="form-control form-control-lg"
                        rows="3"
                        value={formData.exercises}
                        onChange={handleChange}
                        maxLength="1000"
                        placeholder="Ushtrimet dhe detyrat për tu kryer..."
                      />
                    </div>

                    {/* Shënimet */}
                    <div className="mb-4">
                      <label htmlFor="notes" className="form-label fw-semibold">
                        <i className="fas fa-sticky-note me-2 text-primary"></i>
                        Shënime të Shtuara
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="form-control form-control-lg"
                        rows="4"
                        value={formData.notes}
                        onChange={handleChange}
                        maxLength="1000"
                        placeholder="Shënime dhe vërejtje shtesë për seancën..."
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
                        className="btn btn-primary btn-lg py-3 fw-semibold order-md-2 flex-grow-1 ms-md-2"
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

export default EditTherapySession;