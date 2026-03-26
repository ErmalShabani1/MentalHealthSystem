import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("🔄 Duke filluar login...");
  console.log("📧 Email:", formData.email);
  
  try {
    console.log("📤 Duke dërguar request...");
    const res = await loginUser(formData);
    console.log("✅ Response nga backend:", res.data);
    console.log("👤 User data:", res.data.user);
    
    // Ruaj vetëm të dhënat thelbësore: id, username dhe role
    const userData = {
      id: res.data.user.id,
      username: res.data.user.username,
      role: res.data.user.role
    };
    
    console.log("💾 Duke ruajtur në localStorage:", userData);
    
    // Ruaj psikologId nëse është psikolog
    if (userData.role.toLowerCase() === "psikolog" && res.data.user.psikologId) {
      localStorage.setItem("psikologId", res.data.user.psikologId);
      console.log("✅ psikologId u ruajt:", res.data.user.psikologId);
    }

    // Ruaj patientId nëse është pacient
    if (userData.role.toLowerCase() === "pacient" && res.data.user.patientId) {
      localStorage.setItem("patientId", res.data.user.patientId);
      console.log("✅ patientId u ruajt:", res.data.user.patientId);
    }

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);

    toast.success(`Mire se erdhe ${userData.username}!`, {
      autoClose: 3000,
      onClose: () => {
        if (userData.role === "Pacient") {
          navigate("/pacientDashboard");
        } else if (userData.role === "Psikolog") {
          navigate("/psikologDashboard");
        } else if (userData.role === "User") {
          navigate("/pending-authorization");
        } else {
          navigate("/adminDashboard");
        }
      },
    });
  } catch (err) {
    console.error("❌ Error gjatë login:", err);
    console.error("📋 Error response:", err.response);
    console.error("📋 Error data:", err.response?.data);
    console.error("📋 Error status:", err.response?.status);
    toast.error(err.response?.data || "Email ose password i gabuar!");
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
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="text"
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
            Login
          </button>
        </form>
        <div className="text-center">
          <p className="mb-2">Nuk ke llogari?</p>
          <Link to="/register" className="btn btn-success">
            Register
          </Link>
          </div>
      </div>
      
    </div>
  );
}


export default Login;
