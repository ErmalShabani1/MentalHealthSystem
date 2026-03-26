import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyUshtrimet } from "../../services/UshtrimiService";
import PatientSidePanel from "./PatientSidePanel";

function ShfaqUshtrimet() {
  const [ushtrimet, setUshtrimet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUshtrimet();
  }, []);

  const fetchUshtrimet = async () => {
    try {
      setLoading(true);

      console.log("🔍 Duke thirrur endpoint /for-patient...");
      console.log(
        "🔍 PatientId nga localStorage:",
        localStorage.getItem("patientId")
      );
      console.log(
        "🔍 AuthToken ekziston:",
        !!localStorage.getItem("authToken")
      );

      const response = await getMyUshtrimet();
      console.log("✅ Status i përgjigjes:", response.status);
      console.log("📋 E gjithë përgjigja:", response);
      console.log("📋 Të dhënat e marra:", response.data);
      console.log("📋 Numri i ushtrimeve:", response.data.length);

      if (response.data.length > 0) {
        console.log("🔍 Struktura e ushtrimit të parë:", response.data[0]);
        console.log("🔍 Çelësat e ushtrimit të parë:", Object.keys(response.data[0]));
      }

      setUshtrimet(response.data);
    } catch (error) {
      console.error("❌ Gabim i detajuar:", error);
      console.error("📋 Të dhënat e gabimit:", error.response?.data);

      if (error.response?.status === 400) {
        toast.error(
          "Gabim në kërkesë: " +
            (error.response.data || "Kontrolloni token-in")
        );
      } else if (error.response?.status === 401) {
        toast.error("Nuk jeni i autorizuar. Kontrolloni identifikimin.");
      } else if (error.response?.status === 403) {
        toast.error("Nuk keni të drejtë për këtë veprim.");
      } else {
        toast.error("Gabim gjatë marrjes së ushtrimeve");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("sq-AL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <PatientSidePanel section="ushtrime" activePath="/shfaq-ushtrimet" />

      {/* Përmbajtja kryesore */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "240px", backgroundColor: "#f8f9fa" }}
      >
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Ushtrimet e Mia</h2>
            <div className="text-muted">
              {new Date().toLocaleDateString("sq-AL")}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Duke ngarkuar...</span>
              </div>
              <p className="mt-2">Duke ngarkuar ushtrimet...</p>
            </div>
          ) : (
            <div className="row">
              {ushtrimet.length === 0 ? (
                <div className="col-12">
                  <div className="card shadow-sm text-center py-5">
                    <i className="fas fa-dumbbell fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Nuk keni ushtrime</h5>
                    <p className="text-muted">
                      Ushtrimet tuaja do të shfaqen këtu sapo të jenë të
                      disponueshme.
                    </p>
                  </div>
                </div>
              ) : (
                ushtrimet.map((ushtrimi) => (
                  <div key={ushtrimi.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-header bg-success text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{ushtrimi.titulli}</h6>
                          {!ushtrimi.patientId && (
                            <span className="badge bg-light text-dark">
                              Ushtrim i Përgjithshëm
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          {ushtrimi.pershkrimi.length > 150
                            ? `${ushtrimi.pershkrimi.substring(0, 150)}...`
                            : ushtrimi.pershkrimi}
                        </p>
                      </div>
                      <div className="card-footer bg-transparent">
                        <div className="row text-muted small">
                          <div className="col-6">
                            <i className="fas fa-calendar me-1"></i>
                            {formatDate(ushtrimi.dataKrijimit)}
                          </div>
                          <div className="col-6 text-end">
                            <i className="fas fa-user-md me-1"></i>
                            Psikologu
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {ushtrimet.length > 0 && (
            <div className="mt-4">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Informacion:</strong> Këtu shfaqen të gjitha ushtrimet e
                përgjithshme dhe ato specifike që psikologu juaj ka krijuar për
                ju.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShfaqUshtrimet;
