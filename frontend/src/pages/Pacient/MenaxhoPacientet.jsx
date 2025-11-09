import React, { useEffect, useState } from "react";
import { getAllPatients, deletePacientin } from "../../services/PacientiService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MenaxhoPacientet() {
  const [pacient, setPacients] = useState([]);

  const fetchData = async () => {
    const res = await getAllPatients();
    setPacients(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë pacient?")) {
      await deletePacientin(id);
      toast.success("Pacienti u fshi me sukses!");
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", position: "fixed", height: "100vh" }}
      >
        <h4 className="mb-4 text-center">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/adminDashboard" className="nav-link text-white">
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/add-pacientin" className="nav-link text-white">
              ➕ Shto Pacient
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoPacientet" className="nav-link text-white">
              👨‍⚕️ Menaxho Pacientet
            </Link>
          </li>
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Menaxho Pacientet</h2>

          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Emri</th>
                <th>Mbiemri</th>
                <th>Mosha</th>
                <th>Gjinia </th>
                <th>Diagnoza </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pacient.map((p) => (
                <tr key={p.id}>
                  <td>{p.user.username}</td>
                  <td>{p.user.email}</td>
                  <td>{p.emri}</td>
                  <td>{p.mbiemri}</td>
                  <td>{p.mosha}</td>
                  <td>{p.gjinia}</td>
                  <td>{p.diagnoza}</td>
                  <td>
                    <Link
                      to={`/edit-pacientin/${p.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MenaxhoPacientet;
