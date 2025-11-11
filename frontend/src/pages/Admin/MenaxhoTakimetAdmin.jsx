

import React, { useEffect, useState } from "react";
import { getAllAppointmentsAdmin, deleteTakimin } from "../../services/AppointmentService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MenaxhoTakimetAdmin() {
  const [takimet, setTakimet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTakimet();
  }, []);

  const fetchTakimet = async () => {
    try {
      const res = await getAllAppointmentsAdmin();
      setTakimet(res.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së takimeve:", error);
      toast.error("Gabim gjatë marrjes së takimeve");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Jeni i sigurt që dëshironi të fshini këtë takim?")) {
      try {
        await deleteTakimin(id);
        toast.success("Takimi u fshi me sukses!");
        fetchTakimet();
      } catch (error) {
        toast.error("Gabim gjatë fshirjes së takimit");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5">Duke ngarkuar...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Menaxho Takimet - Admin</h2>
        <span className="badge bg-primary">Total: {takimet.length}</span>
      </div>

      {takimet.length === 0 ? (
        <div className="alert alert-info">Nuk ka takime për të shfaqur</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Pacienti</th>
                <th>Psikologu</th>
                <th>Data dhe Koha</th>
                <th>Statusi</th>
                <th>Shënime</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {takimet.map((takimi, index) => (
                <tr key={takimi.id}>
                  <td>{index + 1}</td>
                  <td>
                    {takimi.patient?.emri && takimi.patient?.mbiemri 
                      ? `${takimi.patient.emri} ${takimi.patient.mbiemri}`
                      : takimi.patientName || "N/A"
                    }
                  </td>
                  <td>
                    {takimi.psikologi?.emri && takimi.psikologi?.mbiemri 
                      ? `${takimi.psikologi.emri} ${takimi.psikologi.mbiemri}`
                      : "N/A"
                    }
                  </td>
                  <td>
                    {new Date(takimi.appointmentDate).toLocaleDateString('sq-AL')}
                    <br />
                    <small className="text-muted">
                      {new Date(takimi.appointmentDate).toLocaleTimeString('sq-AL')}
                    </small>
                  </td>
                  <td>
                    <span className={`badge ${
                      takimi.status === 'Completed' ? 'bg-success' : 
                      takimi.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                    }`}>
                      {takimi.status}
                    </span>
                  </td>
                  <td>
                    {takimi.notes ? (
                      <span title={takimi.notes}>
                        {takimi.notes.length > 30 
                          ? `${takimi.notes.substring(0, 30)}...` 
                          : takimi.notes
                        }
                      </span>
                    ) : (
                      <span className="text-muted">Nuk ka shënime</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link 
                        to={`/edit-takimin-admin/${takimi.id}`} 
                        className="btn btn-warning"
                      >
                        ✏️ Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(takimi.id)}
                        className="btn btn-danger"
                      >
                        🗑️ Fshi
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MenaxhoTakimetAdmin;