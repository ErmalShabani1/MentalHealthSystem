import React, { useEffect, useState } from "react";
import { getAllPsikologet, deletePsikologin } from "../../services/PsikologiService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function MenaxhoPsikologet() {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
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
      const res = await getAllPsikologet();
      setPsychologists(res.data || []);
    } catch (err) {
      console.error("Error fetching psychologists:", err);
      setError("Gabim gjatë marrjes së të dhënave. Ju lutem kontrolloni lidhjen me serverin.");
      toast.error("Gabim gjatë marrjes së psikologëve!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë psikolog?")) {
      try {
        await deletePsikologin(id);
        toast.success("Psikologu u fshi me sukses!");
        fetchData();
      } catch (err) {
        console.error("Error deleting psychologist:", err);
        toast.error("Gabim gjatë fshirjes së psikologut!");
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
        <h4 className="mb-4 text-center">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/adminDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/add-psikologin" className="nav-link text-white">
              ➕ Shto Psikolog
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoPsikologet" className="nav-link text-white">
              👨‍⚕️ Menaxho Psikologët
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
          <h2 className="mb-4">Menaxho Psikologët</h2>

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

          {!loading && !error && psychologists.length === 0 && (
            <div className="alert alert-info" role="alert">
              Nuk ka psikologë të regjistruar.
            </div>
          )}

          {!loading && !error && psychologists.length > 0 && (
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Specialization</th>
                  <th>Experience Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {psychologists.map((p) => (
                  <tr key={p.id}>
                    <td>{p.user?.username || "N/A"}</td>
                    <td>{p.user?.email || "N/A"}</td>
                    <td>{p.name || "N/A"}</td>
                    <td>{p.surname || "N/A"}</td>
                    <td>{p.specialization || "N/A"}</td>
                    <td>{p.experienceLevel || "N/A"}</td>
                    <td>
                      <Link
                        to={`/edit-psikologin/${p.id}`}
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

export default MenaxhoPsikologet;
