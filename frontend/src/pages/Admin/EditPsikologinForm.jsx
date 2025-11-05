import React, { useState, useEffect } from "react";
import { updatePsikologin, getAllPsikologet } from "../../services/PsikologiService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditPsikologinForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name:"",
    surname:"",
    specialization: "",
    experienceLevel: "",
  });

  const fetchData = async () => {
    const res = await getAllPsikologet();
    const psych = res.data.find((p) => p.id === parseInt(id));
    setFormData({ name: psych.name,surname: psych.surname,specialization: psych.specialization, experienceLevel: psych.experienceLevel });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePsikologin(id, formData);
    toast.success("Psikologu u përditësua me sukses!");
    navigate("/adminDashboard");
  };

  return (
    <div className="container mt-5">
      <h3>Përditëso Psikologun</h3>
      <form onSubmit={handleSubmit}>
         <input name="name" className="form-control mb-2" value={formData.name} onChange={handleChange} />
          <input name="surname" className="form-control mb-2" value={formData.surname} onChange={handleChange} />
        <input name="specialization" className="form-control mb-2" value={formData.specialization} onChange={handleChange} />
        <input name="experienceLevel" className="form-control mb-2" value={formData.experienceLevel} onChange={handleChange} />
        <button type="submit" className="btn btn-success w-100">Ruaj Ndryshimet</button>
      </form>
    </div>
  );
}

export default EditPsikologinForm;
