import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {getAllRaportet,getRaportetStats} from "../../services/RaportService";
import { logoutUser } from "../../services/authService";

function RaportetAdmin() {
  const navigate = useNavigate();

  const [raportet, setRaportet] = useState([]);
  const [filteredRaportet, setFilteredRaportet] = useState([]);
  const [showThisMonth, setShowThisMonth] = useState(false);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    fetchRaportet();
    fetchStats();
  }, []);

  const fetchRaportet = async () => {
    try {
      setLoading(true);
      const response = await getAllRaportet();
      setRaportet(response.data);
    } catch (error) {
      toast.error("Gabim gjatë marrjes së raporteve");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getRaportetStats();
      setStats(res.data);
    } catch {
      toast.error("Gabim gjatë marrjes së statistikave");
    }
  };

  // Filtrimi për raportet e këtij muaji
  const generateThisMonthReports = () => {
    const now = new Date();

    const thisMonthReports = raportet.filter(r => {
      const date = new Date(r.createdAt);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });

    setFilteredRaportet(thisMonthReports);
    setShowThisMonth(true);
  };

  // Gjenerim PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Raportet Mjekësore - Admin", 14, 20);

    doc.setFontSize(11);
    doc.text(
      `Gjeneruar me: ${new Date().toLocaleDateString("sq-AL")}`,
      14,
      30
    );

    const tableData = reportsToShow.map(r => [
      r.title,
      r.psikologName,
      r.diagnoza,
      new Date(r.createdAt).toLocaleDateString("sq-AL")
    ]);

autoTable(doc, {
  startY: 40,
  head: [["Titulli", "Psikologu", "Diagnoza", "Data"]],
  body: tableData
});
    doc.save("raportet-mujore.pdf");
  };

  // Chart për raportet e muajit
  const getDailyStatsThisMonth = () => {
    const stats = {};
    filteredRaportet.forEach(r => {
      const day = new Date(r.createdAt).getDate();
      stats[day] = (stats[day] || 0) + 1;
    });
    return stats;
  };

  const reportsToShow = showThisMonth ? filteredRaportet : raportet;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh" }}
      >
        <h4 className="mb-4 text-center">Admin Panel</h4>

        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/adminDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/raportet-admin" className="nav-link text-white active">
              📊 Raportet
            </Link>
          </li>
        </ul>

        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={() => navigate(-1)} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Raportet</h2>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={generateThisMonthReports}
              >
                📊 Gjenero Raportet (Këtë muaj)
              </button>

              <button
                className="btn btn-success me-2"
                onClick={generatePDF}
              >
                📄 Gjenero PDF
              </button>

              <div className="text-muted text-end mt-1">
                {new Date().toLocaleDateString("sq-AL")}
              </div>
            </div>
          </div>

          {/* Statistikat */}
          {stats && (
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card text-center shadow-sm">
                  <div className="card-body">
                    <h6>Total Raporte</h6>
                    <h3>{stats.totalReports}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center shadow-sm">
                  <div className="card-body">
                    <h6>Këtë muaj</h6>
                    <h3>{stats.thisMonthReports}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shfaq të gjitha */}
          {showThisMonth && (
            <button
              className="btn btn-outline-secondary mb-3"
              onClick={() => setShowThisMonth(false)}
            >
              🔄 Shfaq të gjitha raportet
            </button>
          )}

          {/* Chart bar mujor */}
          {showThisMonth && filteredRaportet.length > 0 && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">📊 Raportet për ditë (këtë muaj)</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-end" style={{ height: "200px" }}>
                  {Object.entries(getDailyStatsThisMonth()).map(([day, count]) => (
                    <div
                      key={day}
                      className="text-center me-2"
                      style={{ width: "30px" }}
                    >
                      <div
                        className="bg-primary"
                        style={{
                          height: `${count * 30}px`,
                          borderRadius: "4px"
                        }}
                        title={`${count} raporte`}
                      ></div>
                      <small>{day}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loader */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  Lista e Raporteve ({reportsToShow.length})
                </h5>
              </div>

              <div className="card-body p-0">
                {reportsToShow.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    Nuk ka raporte për këtë periudhë
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Titulli</th>
                          <th>Psikologu</th>
                          <th>Diagnoza</th>
                          <th>Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportsToShow.map(rap => (
                          <tr key={rap.id}>
                            <td>
                              <strong>{rap.title}</strong>
                              <br />
                              <small className="text-muted">
                                {rap.description?.substring(0, 50)}...
                              </small>
                            </td>
                            <td>{rap.psikologName}</td>
                            <td>
                              <span className="badge bg-warning text-dark">
                                {rap.diagnoza}
                              </span>
                            </td>
                            <td>
                              {new Date(rap.createdAt).toLocaleDateString("sq-AL")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RaportetAdmin;
