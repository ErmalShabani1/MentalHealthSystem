import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointmentById, updateTakimin } from "../../services/AppointmentService";
import { toast } from "react-toastify";
import axios from "axios";

function EditTakiminAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: "",
    psikologId: "",
    appointmentDate: "",
    notes: "",
    status: "Scheduled",
  });

  const [patients, setPatients] = useState([]);
  const [psikologet, setPsikologet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Merr të gjithë pacientët dhe psikologët
    const fetchData = async () => {
      try {
        const [patientsRes, psikologetRes] = await Promise.all([
          axios.get("https://localhost:7062/api/Patient/get-all", { withCredentials: true }),
          axios.get("https://localhost:7062/api/Psikologi/get-all", { withCredentials: true })
        ]);
        
        setPatients(patientsRes.data);
        setPsikologet(psikologetRes.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
        toast.error("Gabim gjatë marrjes së listës së pacientëve/psikologëve");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTakimi = async () => {
      try {
        setLoading(true);
        const res = await getAppointmentById(id);
        const takimi = res.data;
        
        if (takimi) {
          console.log("Takimi i marrë:", takimi);
          setFormData({
            patientId: takimi.patientId || "",
            psikologId: takimi.psikologId || "",
            appointmentDate: takimi.appointmentDate ? takimi.appointmentDate.slice(0, 16) : "",
            notes: takimi.notes || "",
            status: takimi.status || "Scheduled",
          });
        } else {
          toast.error("Takimi nuk u gjet!");
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së takimit:", error);
        toast.error("Gabim gjatë marrjes së të dhënave të takimit");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchTakimi();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId) {
      toast.error("Zgjidhni një pacient!");
      return;
    }

    if (!formData.psikologId) {
      toast.error("Zgjidhni një psikolog!");
      return;
    }

    if (!formData.appointmentDate) {
      toast.error("Zgjidhni datën dhe kohën e takimit!");
      return;
    }

    try {
      const updatedData = { 
        ...formData, 
        id: parseInt(id),
        patientId: parseInt(formData.patientId),
        psikologId: parseInt(formData.psikologId)
      };
      
      console.log("Duke dërguar të dhënat:", updatedData);
      
      await updateTakimin(id, updatedData);
      toast.success("Takimi u përditësua me sukses!");
      navigate("/menaxhoTakimetAdmin");
    } catch (error) {
      console.error("Gabim i plotë:", error);
      toast.error(error.response?.data || "Gabim gjatë përditësimit të takimit!");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Duke ngarkuar...</span>
          </div>
          <p className="mt-2">Duke ngarkuar të dhënat e takimit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Përditëso Takimin - Admin</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pacienti</label>
                    <select
                      name="patientId"
                      className="form-control"
                      value={formData.patientId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh Pacientin</option>
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.emri} {p.mbiemri}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Psikologu</label>
                    <select
                      name="psikologId"
                      className="form-control"
                      value={formData.psikologId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh Psikologun</option>
                      {psikologet.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.surname}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Data dhe Koha e Takimit</label>
                  <input
                    name="appointmentDate"
                    type="datetime-local"
                    className="form-control"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Shënime</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    placeholder="Shënime shtesë për takimin..."
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Statusi</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Scheduled">I planifikuar</option>
                    <option value="Completed">I përfunduar</option>
                    <option value="Cancelled">I anuluar</option>
                  </select>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate("/menaxhoTakimetAdmin")}
                  >
                    Anulo
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Ruaj Ndryshimet
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

export default EditTakiminAdmin;