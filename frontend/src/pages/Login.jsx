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
    try {
      const res = await loginUser(formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success(`Mire se erdhe ${res.data.username}!`, {
      autoClose: 3000,
      onClose: () => {
        if (res.data.role === "User") {
          navigate("/userDashboard");
        } else {
          navigate("/adminDashboard");
        }
      },
    });
    } catch (err) {
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
