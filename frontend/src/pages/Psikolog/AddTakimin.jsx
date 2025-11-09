import React, { useState, useEffect } from "react";
import { addTakimin } from "../../services/AppointmentService";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function AddTakimin() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    psikologId: localStorage.getItem("psikologId"),
    patientId: "", // tani po ruajmë ID e pacientit
    appointmentDate: "",
    notes: "",
  });

  const [patients ,setPatients] = useState([]);

  useEffect(() => {
    // Merr të gjithë pacientët nga backend
    const fetchPatients = async () => {
      try {
        const res = await axios.get("http://localhost:5054/api/Patient/get-all", {
          withCredentials: true,
        });
        setPatients(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së pacientëve:", error);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
  const value =
    e.target.name === "patientId" ? parseInt(e.target.value) : e.target.value;
  setFormData({ ...formData, [e.target.name]: value });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      toast.error("Zgjidhni një pacient!");
      return;
    }

    try {
      await addTakimin(formData);
      toast.success("Takimi u shtua me sukses!");
      navigate("/psikologDashboard")
      setFormData({
        psikologId: localStorage.getItem("psikologId"),
        patientId: "",
        appointmentDate: "",
        notes: "",
      });
      
    } catch (error) {
      toast.error(
        error.response?.data || "Gabim gjatë shtimit të takimit!"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h3>Shto Takim</h3>
      <form onSubmit={handleSubmit}>
        <select
          name="patientId"
          className="form-control mb-2"
          value={formData.patientId}
          onChange={handleChange}
        >
          <option value="">Zgjidh Pacientin</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.emri} 
            </option>
          ))}
        </select>

        <input
          name="appointmentDate"
          type="datetime-local"
          className="form-control mb-2"
          value={formData.appointmentDate}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Shënime"
          className="form-control mb-2"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-success w-100">
          Shto Takim
        </button>
      </form>
    </div>
  );
}

export default AddTakimin;
