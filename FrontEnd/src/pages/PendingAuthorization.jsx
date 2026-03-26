import React from "react";
import { logoutUser } from "../services/authService";

function PendingAuthorization() {
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div className="card shadow-sm border-0" style={{ maxWidth: "560px", width: "100%" }}>
        <div className="card-body p-4 p-md-5 text-center">
          <h3 className="mb-3">Llogaria juaj është në pritje</h3>
          <p className="text-muted mb-4">
            Regjistrimi u krye me sukses. Llogaria juaj aktualisht ka rolin "User" dhe
            është në pritje të autorizimit nga administratori.
          </p>
          <p className="text-muted mb-4">
            Deri atëherë nuk keni qasje në shërbimet e sistemit.
          </p>
          <button onClick={handleLogout} className="btn btn-danger px-4">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingAuthorization;
