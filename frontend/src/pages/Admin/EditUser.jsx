import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../services/userService";
import { toast } from "react-toastify";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "User",
    password: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetchLoading(true);
        const res = await getUserById(id);
        setFormData({
          username: res.data.username || "",
          email: res.data.email || "",
          role: res.data.role || "User",
          password: ""
        });
      } catch (error) {
        console.error("Gabim gjatë marrjes së përdoruesit:", error);
        toast.error("Gabim gjatë marrjes së të dhënave");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(id, formData);
      toast.success("Përdoruesi u përditësua me sukses!");
      setTimeout(() => navigate("/menaxhoUserat"), 1500);
    } catch (error) {
      console.error("Gabim gjatë përditësimit:", error);
      toast.error(error.response?.data || "Gabim gjatë përditësimit!");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Duke ngarkuar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Edito Përdoruesin</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Roli</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Psikolog">Psikolog</option>
                    <option value="Pacient">Pacient</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password i Ri (opsionale)</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Lër bosh nëse nuk dëshiron ta ndryshosh"
                  />
                  <small className="text-muted">
                    Nëse nuk dëshiron të ndryshosh password-in, lër këtë fushë bosh
                  </small>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/menaxhoUserat")}
                  >
                    ← Kthehu
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Duke ruajtur..." : "💾 Ruaj Ndryshimet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
