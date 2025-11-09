import React, { useState, useEffect } from "react";
import { updatePacientin, getAllPatients} from "../../services/PacientiService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditPacientinForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emri:"",
    mbiemri:"",
    mosha: "",
    gjinia: "",
    diagnoza:"",
  });

  const fetchData = async () => {
    const res = await getAllPatients();
    const psych = res.data.find((p) => p.id === parseInt(id));
    setFormData({ emri: psych.emri,mbiemri: psych.mbiemri,mosha: psych.mosha, gjinia: psych.gjinia, diagnoza: psych.diagnoza });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePacientin(id, formData);
    toast.success("Pacienti u përditësua me sukses!");
    navigate("/adminDashboard");
  };

  return (
    <div className="container mt-5">
      <h3>Përditëso Pacientin</h3>
      <form onSubmit={handleSubmit}>
         <input name="emri" className="form-control mb-2" value={formData.emri} onChange={handleChange} />
          <input name="mbiemri" className="form-control mb-2" value={formData.mbiemri} onChange={handleChange} />
        <input name="mosha" className="form-control mb-2" value={formData.mosha} onChange={handleChange} />
        <input name="gjinia" className="form-control mb-2" value={formData.gjinia} onChange={handleChange} />
        <input name="diagnoza" className="form-control mb-2" value={formData.diagnoza} onChange={handleChange} />
        <button type="submit" className="btn btn-success w-100">Ruaj Ndryshimet</button>
      </form>
    </div>
  );
}

export default EditPacientinForm;
