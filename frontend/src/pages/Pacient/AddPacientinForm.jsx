import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const API_URL = "https://localhost:7062/api/Patient/add";

function AddPacientinForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    emri:"",
    mbiemri:"",
    mosha: "",
    gjinia: "",
    diagnoza:"",
    
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData, { withCredentials: true });
      toast.success("Pacienti u shtua me sukses!");
      setFormData({ username: "", email: "", password: "",emri:"",mbiemri:"", mosha: "", gjinia: "",diagnoza:"" });
    } catch (error) {
      toast.error("Gabim gjatë shtimit të pacientit!");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Shto Pacient</h3>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" className="form-control mb-2" value={formData.username} onChange={handleChange} />
        <input name="email" placeholder="Email" className="form-control mb-2" value={formData.email} onChange={handleChange} />
        <input name="password" placeholder="Password" className="form-control mb-2" value={formData.password} onChange={handleChange} />
         <input name="emri" placeholder="Emri" className="form-control mb-2" value={formData.emri} onChange={handleChange} />
          <input name="mbiemri" placeholder="Mbiemri" className="form-control mb-2" value={formData.mbiemri} onChange={handleChange} />
           <input name="mosha" placeholder="Mosha" className="form-control mb-2" value={formData.mosha} onChange={handleChange} />
        <input name="gjinia" placeholder="Gjinia" className="form-control mb-2" value={formData.gjinia} onChange={handleChange} />
        <input name="diagnoza" placeholder="Diagnoza" className="form-control mb-2" value={formData.diagnoza} onChange={handleChange} />
        <button type="submit" className="btn btn-success w-100">Shto Pacient</button>
      </form>
    </div>
  );
}

export default AddPacientinForm;
