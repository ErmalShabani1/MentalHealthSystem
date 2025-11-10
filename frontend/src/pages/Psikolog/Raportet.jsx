import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatientReports } from "../../services/AppointmentService";
import { toast } from "react-toastify";

function Raportet() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPatient, setExpandedPatient] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const psikologId = localStorage.getItem("psikologId");
        
        if (!psikologId) {
          setError("Psikolog ID nuk u gjet. Ju lutem kyçuni përsëri.");
          return;
        }

        const res = await getPatientReports(psikologId);
        setReports(res.data || []);
      } catch (err) {
        console.error("Gabim gjatë marrjes së raporteve:", err);
        const errorMessage = err.response?.data || err.message || "Gabim gjatë marrjes së raporteve.";
        setError(errorMessage);
        toast.error("Gabim gjatë marrjes së raporteve!");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const togglePatient = (patientId) => {
    setExpandedPatient(expandedPatient === patientId ? null : patientId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sq-AL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "badge bg-success";
      case "scheduled":
        return "badge bg-primary";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh" }}
      >
        <h4 className="mb-4 text-center">Psikolog Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/psikologDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/add-takimet" className="nav-link text-white">
              ➕ Shto Takim
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoTakimet" className="nav-link text-white">
              📋 Menaxho Takimet
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/raportet" className="nav-link text-white">
              📊 Raportet e Pacientëve
            </Link>
          </li>
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Raportet e Pacientëve</h2>

          {loading && (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Duke u ngarkuar...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div className="alert alert-info" role="alert">
              Nuk ka raporte të disponueshme. Nuk ka pacientë me takime të regjistruara.
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div className="row">
              {reports.map((report) => (
                <div key={report.patientId} className="col-12 mb-4">
                  <div className="card shadow-sm">
                    <div
                      className="card-header bg-primary text-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => togglePatient(report.patientId)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-0">
                            {report.patientName}
                            <span className="badge bg-light text-dark ms-2">
                              {report.appointments?.length || 0} Takime
                            </span>
                          </h5>
                          <small>
                            {report.email} | {report.mosha} vjeç | {report.gjinia}
                          </small>
                        </div>
                        <span className="badge bg-light text-dark">
                          {expandedPatient === report.patientId ? "▼" : "▶"}
                        </span>
                      </div>
                    </div>

                    {expandedPatient === report.patientId && (
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <strong>Email:</strong> {report.email}
                          </div>
                          <div className="col-md-3">
                            <strong>Mosha:</strong> {report.mosha} vjeç
                          </div>
                          <div className="col-md-3">
                            <strong>Gjinia:</strong> {report.gjinia}
                          </div>
                        </div>
                        <div className="mb-3">
                          <strong>Diagnoza:</strong>
                          <div className="alert alert-info mb-0 mt-2">
                            {report.diagnoza || "Nuk ka diagnozë të regjistruar"}
                          </div>
                        </div>

                        <h6 className="mt-4 mb-3">Takimet dhe Shenimet:</h6>
                        {report.appointments && report.appointments.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-striped table-hover">
                              <thead className="table-dark">
                                <tr>
                                  <th>Data</th>
                                  <th>Statusi</th>
                                  <th>Shenime</th>
                                </tr>
                              </thead>
                              <tbody>
                                {report.appointments.map((appointment) => (
                                  <tr key={appointment.appointmentId}>
                                    <td>{formatDate(appointment.appointmentDate)}</td>
                                    <td>
                                      <span className={getStatusBadgeClass(appointment.status)}>
                                        {appointment.status || "N/A"}
                                      </span>
                                    </td>
                                    <td>
                                      {appointment.notes ? (
                                        <div className="text-break">{appointment.notes}</div>
                                      ) : (
                                        <span className="text-muted">Nuk ka shenime</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="alert alert-warning">
                            Nuk ka takime të regjistruara për këtë pacient.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Raportet;

