import React, { useEffect, useState } from "react";
import { getAllPatients, deletePacientin } from "../../services/PacientiService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function MenaxhoPacientetPsikolog() {
  const navigate = useNavigate();
  const [pacient, setPacients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllPatients();
      setPacients(res.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
      const errorMessage = err.response?.data || err.message || "Gabim i panjohur";
      const statusCode = err.response?.status;
      
      if (statusCode === 401 || statusCode === 403) {
        setError("Ju nuk keni autorizim për të parë këto të dhëna. Ju lutem kyçuni si Admin ose Psikolog.");
        toast.error("Probleme me autorizimin!");
      } else if (statusCode === 500) {
        setError(`Gabim në server: ${errorMessage}`);
        toast.error("Gabim në server!");
      } else {
        setError(`Gabim gjatë marrjes së të dhënave: ${errorMessage}`);
        toast.error("Gabim gjatë marrjes së pacientëve!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë pacient?")) {
      try {
        await deletePacientin(id);
        toast.success("Pacienti u fshi me sukses!");
        fetchData();
      } catch (err) {
        console.error("Error deleting patient:", err);
        toast.error("Gabim gjatë fshirjes së pacientit!");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            <Link to="/add-pacientin" className="nav-link text-white">
              ➕ Shto Pacient
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoPacientet-Psikolog" className="nav-link text-white">
              👨‍⚕️ Menaxho Pacientet
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

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Menaxho Pacientet</h2>

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

          {!loading && !error && pacient.length === 0 && (
            <div className="alert alert-info" role="alert">
              Nuk ka pacientë të regjistruar.
            </div>
          )}

          {!loading && !error && pacient.length > 0 && (
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Emri</th>
                  <th>Mbiemri</th>
                  <th>Mosha</th>
                  <th>Gjinia</th>
                  <th>Diagnoza</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pacient.map((p) => (
                  <tr key={p.id}>
                    <td>{p.user?.username || "N/A"}</td>
                    <td>{p.user?.email || "N/A"}</td>
                    <td>{p.emri || "N/A"}</td>
                    <td>{p.mbiemri || "N/A"}</td>
                    <td>{p.mosha || "N/A"}</td>
                    <td>{p.gjinia || "N/A"}</td>
                    <td>{p.diagnoza || "N/A"}</td>
                    <td>
                      <Link
                        to={`/edit-pacientin/${p.id}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenaxhoPacientetPsikolog;
