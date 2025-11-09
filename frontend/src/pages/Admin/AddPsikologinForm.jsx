import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const API_URL = "http://localhost:5054/api/Psikologi/add";

function AddPsikologinForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name:"",
    surname:"",
    specialization: "",
    experienceLevel: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData, { withCredentials: true });
      toast.success("Psikologu u shtua me sukses!");
      setFormData({ username: "", email: "", password: "",name:"",surname:"", specialization: "", experienceLevel: "" });
    } catch (error) {
      toast.error("Gabim gjatë shtimit të psikologut!");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Shto Psikolog</h3>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" className="form-control mb-2" value={formData.username} onChange={handleChange} />
        <input name="email" placeholder="Email" className="form-control mb-2" value={formData.email} onChange={handleChange} />
        <input name="password" placeholder="Password" className="form-control mb-2" value={formData.password} onChange={handleChange} />
         <input name="name" placeholder="Emri" className="form-control mb-2" value={formData.name} onChange={handleChange} />
          <input name="surname" placeholder="Mbiemri" className="form-control mb-2" value={formData.surname} onChange={handleChange} />
           <input name="specialization" placeholder="Specializimi" className="form-control mb-2" value={formData.specialization} onChange={handleChange} />
        <input name="experienceLevel" placeholder="Niveli i eksperiencës" className="form-control mb-2" value={formData.experienceLevel} onChange={handleChange} />
        <button type="submit" className="btn btn-success w-100">Shto Psikolog</button>
      </form>
    </div>
  );
}

export default AddPsikologinForm;
