import React, { useEffect, useState } from "react";
import { getTakimetByPsikologId } from "../../services/AppointmentService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PsikologSidePanel from "./PsikologSidePanel";

function PacientetEMi() {
  const [pacientet, setPacientet] = useState([]);
  const [loading, setLoading] = useState(true);
  const psikologId = localStorage.getItem("psikologId");

  // Merr takimet dhe nxirr pacientët unikë
  const fetchPacientet = async () => {
    try {
      setLoading(true);
      const res = await getTakimetByPsikologId(psikologId);
      
      // Krijo një listë të pacientëve unikë
      const pacientetUnik = [];
      const pacientIds = new Set();
      
      res.data.forEach(takim => {
        if (!pacientIds.has(takim.patientId)) {
          pacientIds.add(takim.patientId);
          pacientetUnik.push({
            id: takim.patientId,
            emri: takim.patientName,
            takimetTotal: 1, // Do të llogarisim më vonë
            takimiFundit: takim.appointmentDate,
            status: takim.status
          });
        }
      });

      // Llogarit numrin e takimeve për çdo pacient
      const pacientetMeStatistika = pacientetUnik.map(pacient => {
        const takimetEPacientit = res.data.filter(t => t.patientId === pacient.id);
        return {
          ...pacient,
          takimetTotal: takimetEPacientit.length,
          takimetPërfunduar: takimetEPacientit.filter(t => t.status === 'Completed').length,
          takimetAktive: takimetEPacientit.filter(t => t.status === 'Scheduled').length,
          takimiFundit: new Date(Math.max(...takimetEPacientit.map(t => new Date(t.appointmentDate))))
        };
      });

      setPacientet(pacientetMeStatistika);
    } catch (error) {
      console.error("Gabim gjatë marrjes së pacientëve:", error);
      toast.error("Gabim gjatë marrjes së të dhënave të pacientëve");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusPacienti = (pacient) => {
    if (pacient.takimetPërfunduar > 0) return { class: 'success', label: 'Aktiv', icon: '✅' };
    if (pacient.takimetAktive > 0) return { class: 'warning', label: 'Në proces', icon: '⏳' };
    return { class: 'secondary', label: 'I ri', icon: '🆕' };
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <PsikologSidePanel section="paciente" activePath="/pacientetEMi" />

      {/* Përmbajtja kryesore */}
      <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Pacientët e Mi</h2>
              <p className="text-muted mb-0">Lista e të gjithë pacientëve tuaj</p>
            </div>
            <Link to="/add-takimet" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Takim i Ri
            </Link>
          </div>

          {/* Statistikat */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{pacientet.length}</h4>
                      <small>Total Pacientë</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-users fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">
                        {pacientet.filter(p => p.takimetPërfunduar > 0).length}
                      </h4>
                      <small>Pacientë Aktivë</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-user-check fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">
                        {pacientet.filter(p => p.takimetAktive > 0).length}
                      </h4>
                      <small>Në Proces</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-clock fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">
                        {pacientet.reduce((total, p) => total + p.takimetTotal, 0)}
                      </h4>
                      <small>Takime Total</small>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-calendar-alt fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista e Pacientëve */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Lista e Pacientëve</h5>
            </div>
            
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Duke ngarkuar...</span>
                  </div>
                  <p className="mt-2">Duke ngarkuar pacientët...</p>
                </div>
              ) : pacientet.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Nuk keni pacientë</h5>
                  <p className="text-muted">Shtoni pacientin tuaj të parë duke krijuar një takim të ri</p>
                  <Link to="/add-takimet" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Krijo Takim të Ri
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Pacienti</th>
                        <th>Statusi</th>
                        <th>Takime Total</th>
                        <th>Takime Përfunduar</th>
                        <th>Takime Aktive</th>
                        <th>Takimi i Fundit</th>
                        <th className="text-center" width="220">Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pacientet.map((pacient) => {
                        const status = getStatusPacienti(pacient);
                        return (
                          <tr key={pacient.id}>
                            <td>
                              <div>
                                <div className="fw-bold">{pacient.emri}</div>
                                <small className="text-muted">ID: {pacient.id}</small>
                              </div>
                            </td>
                            <td>
                              <span className={`badge bg-${status.class}`}>
                                {status.icon} {status.label}
                              </span>
                            </td>
                            <td>
                              <strong>{pacient.takimetTotal}</strong>
                            </td>
                            <td>
                              <span className="text-success fw-semibold">
                                {pacient.takimetPërfunduar}
                              </span>
                            </td>
                            <td>
                              <span className="text-warning fw-semibold">
                                {pacient.takimetAktive}
                              </span>
                            </td>
                            <td>
                              {pacient.takimiFundit ? (
                                <div>
                                  <div className="fw-semibold">
                                    {new Date(pacient.takimiFundit).toLocaleDateString('sq-AL')}
                                  </div>
                                  <small className="text-muted">
                                    {new Date(pacient.takimiFundit).toLocaleTimeString('sq-AL', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </small>
                                </div>
                              ) : (
                                <span className="text-muted">Asnjë</span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <Link
                                  to={`/add-takimet?patientId=${pacient.id}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="fas fa-plus me-1"></i>
                                  Takim
                                </Link>
                                <Link
                                  to={`/add-raportin?patientId=${pacient.id}`}
                                  className="btn btn-sm btn-outline-success"
                                >
                                  <i className="fas fa-file-medical me-1"></i>
                                  Raport
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Informacion shtesë */}
          <div className="mt-3">
            <small className="text-muted">
              Duke shfaqur {pacientet.length} pacientë
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PacientetEMi;