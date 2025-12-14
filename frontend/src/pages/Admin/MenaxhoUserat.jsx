import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/userService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/authService";

function MenaxhoUserat() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
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
      console.log("🔍 Duke marrë përdoruesit...");
      const res = await getAllUsers();
      console.log("✅ Përdoruesit u morën:", res.data);
      setUsers(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      console.error("Response:", err.response);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
      setError("Gabim gjatë marrjes së të dhënave: " + errorMessage);
      toast.error("Gabim gjatë marrjes së përdoruesve: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë përdorues?")) {
      try {
        await deleteUser(id);
        toast.success("Përdoruesi u fshi me sukses!");
        fetchData();
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Gabim gjatë fshirjes së përdoruesit!");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRoleBadge = (role) => {
    const roleConfig = {
      'Admin': { class: 'bg-danger', label: 'Admin' },
      'Psikolog': { class: 'bg-primary', label: 'Psikolog' },
      'Pacient': { class: 'bg-success', label: 'Pacient' },
      'User': { class: 'bg-secondary', label: 'User' }
    };
    const config = roleConfig[role] || { class: 'bg-secondary', label: role };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

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
            <Link to="/menaxhoUserat" className="nav-link text-white">
              👤 Menaxho Përdoruesit
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-3 border-top">
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
          <button onClick={() => navigate('/adminDashboard')} className="btn btn-secondary w-100">
            ← Kthehu
          </button>
        </div>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Menaxho Përdoruesit</h2>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Duke u ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar të dhënat...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="alert alert-info" role="alert">
              Nuk ka përdorues të regjistruar.
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Roli</th>
                        <th>Data e Regjistrimit</th>
                        <th>Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{user.username}</strong>
                          </td>
                          <td>{user.email}</td>
                          <td>{getRoleBadge(user.role)}</td>
                          <td>
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('sq-AL') : 'N/A'}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link
                                to={`/edit-user/${user.id}`}
                                className="btn btn-warning"
                                title="Edito përdoruesin"
                              >
                                ✏️ Edito
                              </Link>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="btn btn-danger"
                                title="Fshi përdoruesin"
                              >
                                🗑️ Fshi
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenaxhoUserat;
