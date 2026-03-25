import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/auth.css";
 import { ToastContainer } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      toast.success("Regjistrimi u krye me sukses!");
      setFormData({ username: "", email: "", password: "", role: "User" });
    } catch (err) {
      toast.error(err.response?.data || "Gabim gjate regjistrimit!");
    }
  };

  return (
    
    <div className="auth-bg">
      <div className="auth-overlay"></div>
<ToastContainer 
        position="top-center" 
        autoClose={3000} 
        toastClassName="custom-toast"
      />
      <div className="auth-form">
        <h3 className="text-center mb-3">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
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
            <label>Email</label>
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
      
    </div>
    
  );
}

export default Register;
