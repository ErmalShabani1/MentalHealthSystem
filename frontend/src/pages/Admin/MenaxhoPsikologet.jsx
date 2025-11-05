import React, { useEffect, useState } from "react";
import { getAllPsikologet, deletePsikologin } from "../../services/PsikologiService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MenaxhoPsikologet() {
  const [psychologists, setPsychologists] = useState([]);

  const fetchData = async () => {
    const res = await getAllPsikologet();
    setPsychologists(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("A jeni i sigurt që doni ta fshini këtë psikolog?")) {
      await deletePsikologin(id);
      toast.success("Psikologu u fshi me sukses!");
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
            <Link to="/add-psikologin" className="nav-link text-white">
              ➕ Shto Psikolog
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/menaxhoPsikologet" className="nav-link text-white">
              👨‍⚕️ Menaxho Psikologët
            </Link>
          </li>
        </ul>
      </div>

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2 className="mb-4">Menaxho Psikologët</h2>

          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Specialization</th>
                <th>Experience Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {psychologists.map((p) => (
                <tr key={p.id}>
                  <td>{p.user.username}</td>
                  <td>{p.user.email}</td>
                  <td>{p.name}</td>
                  <td>{p.surname}</td>
                  <td>{p.specialization}</td>
                  <td>{p.experienceLevel}</td>
                  <td>
                    <Link
                      to={`/edit-psikologin/${p.id}`}
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

export default MenaxhoPsikologet;
