import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointmentById, getTakimetByPsikologId, updateTakimin } from "../../services/AppointmentService";
import { toast } from "react-toastify";
import axios from "axios";

function EditTakimin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: "",
    appointmentDate: "",
    notes: "",
    status: "Scheduled",
  });

  const [patients, setPatients] = useState([]);

  const resolvePatientIdFromAppointment = (takimi, patientList) => {
    const directId =
      takimi?.patientId ?? takimi?.pacientId ?? takimi?.patientID ?? takimi?.PatientId ?? null;

    if (directId) {
      return String(directId);
    }

    const appointmentPatientName = (takimi?.patientName || takimi?.pacientName || "")
      .toString()
      .trim()
      .toLowerCase();

    if (!appointmentPatientName) {
      return "";
    }

    const matchedPatient = (patientList || []).find((p) => {
      const fullName = `${p.emri || ""} ${p.mbiemri || ""}`.trim().toLowerCase();
      return fullName === appointmentPatientName;
    });

    return matchedPatient ? String(matchedPatient.id) : "";
  };

  useEffect(() => {
    // Merr pacientët për dropdown
    const fetchPatients = async () => {
      try {
        const res = await axios.get("https://localhost:7062/api/Patient/get-all", { withCredentials: true });
        setPatients(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së pacientëve:", error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (patients.length === 0) {
      return;
    }

    const fetchTakimi = async () => {
      try {
        let takimi = null;

        try {
          const byIdRes = await getAppointmentById(id);
          takimi = byIdRes?.data || null;
        } catch {
          const psikologId = localStorage.getItem("psikologId");
          const res = await getTakimetByPsikologId(psikologId);
          takimi = (res.data || []).find((t) => Number(t.id) === Number(id));
        }

        if (takimi) {
          const selectedPatientId = resolvePatientIdFromAppointment(takimi, patients);

          setFormData({
            patientId: selectedPatientId,
            appointmentDate: takimi.appointmentDate ? takimi.appointmentDate.slice(0, 16) : "",
            notes: takimi.notes || "",
            status: takimi.status || "Scheduled",
          });
        } else {
          toast.error("Takimi nuk u gjet.");
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së takimit:", error);
        toast.error("Gabim gjatë marrjes së takimit.");
      }
    };
    fetchTakimi();
  }, [id, patients]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.patientId) {
    toast.error("Zgjidhni një pacient!");
    return;
  }

  try {
    const updatedData = { ...formData, id: parseInt(id), patientId: parseInt(formData.patientId) };
    await updateTakimin(id, updatedData);
    toast.success("Takimi u përditësua me sukses!");
    navigate("/menaxhoTakimet");
  } catch (error) {
    console.error(error);
    toast.error("Gabim gjatë përditësimit të takimit!");
  }
};


  return (
    <div className="container mt-5">
      <h3>Përditëso Takimin</h3>
      <form onSubmit={handleSubmit}>
        <select
          name="patientId"
          className="form-control mb-2"
          value={formData.patientId}
          onChange={handleChange}
          disabled
        >
          <option value="">Zgjidh Pacientin</option>
          {patients.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.emri} {p.mbiemri}
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
          className="form-control mb-2"
          placeholder="Shënime"
          value={formData.notes}
          onChange={handleChange}
        />

        <select
          name="status"
          className="form-control mb-2"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit" className="btn btn-success w-100 mb-2">
          Ruaj Ndryshimet
        </button>
        <button 
          type="button" 
          className="btn btn-secondary w-100"
          onClick={() => navigate('/menaxhoTakimet')}
        >
          ← Kthehu
        </button>
      </form>
    </div>
  );
}

export default EditTakimin;
