import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/userService";
import { toast } from "react-toastify";

function AddUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "User",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      toast.error("Passwordi është i detyrueshëm!");
      return;
    }

    setLoading(true);

    try {
      await createUser(formData);
      toast.success("Përdoruesi u shtua me sukses!");
      setTimeout(() => navigate("/menaxhoUserat"), 1500);
    } catch (error) {
      console.error("Gabim gjatë shtimit:", error);
      toast.error(error.response?.data || "Gabim gjatë shtimit të përdoruesit!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">Shto Përdorues të Ri</h4>
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
                    placeholder="Vendos username"
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
                    placeholder="Vendos email"
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
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Vendos password"
                    minLength="6"
                  />
                  <small className="text-muted">
                    Password duhet të jetë të paktën 6 karaktere
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
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? "Duke shtuar..." : "✅ Shto Përdoruesin"}
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

export default AddUser;
