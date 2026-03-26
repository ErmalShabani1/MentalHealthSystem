import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SECTIONS = {
  takime: {
    title: "📅 Takimet",
    links: [
      { to: "/add-takimet", label: "➕ Shto Takim" },
      { to: "/menaxhoTakimet", label: "📋 Menaxho Takimet" },
    ],
  },
  paciente: {
    title: "👥 Pacientet",
    links: [
      { to: "/add-pacientin", label: "➕ Shto Pacient" },
      { to: "/menaxhoPacientet-Psikolog", label: "📋 Menaxho Pacient" },
      { to: "/pacientetEMi", label: "👥 Pacientet" },
    ],
  },
  terapi: {
    title: "🧘 Terapia",
    links: [
      { to: "/add-terapine", label: "➕ Shto Seance" },
      { to: "/menaxhoTerapine", label: "📋 Menaxho Seanca" },
    ],
  },
  raporte: {
    title: "📄 Raportet",
    links: [
      { to: "/add-raportin", label: "➕ Shto Raport" },
      { to: "/menaxhoRaportet", label: "📋 Menaxho Raportet" },
    ],
  },
  treatmentPlan: {
    title: "📋 Treatment Plan",
    links: [
      { to: "/add-treatmentplan", label: "➕ Shto Plan" },
      { to: "/menaxho-treatmentplan", label: "📊 Menaxho Planet" },
    ],
  },
  ushtrime: {
    title: "💪 Ushtrimet",
    links: [
      { to: "/add-ushtrim", label: "➕ Shto Ushtrim" },
      { to: "/menaxho-ushtrimet", label: "📊 Menaxho Ushtrimet" },
    ],
  },
  news: {
    title: "📰 Lajmet",
    links: [
      { to: "/add-news", label: "➕ Shto Lajm" },
      { to: "/menaxhoNews", label: "📋 Menaxho Lajmet" },
    ],
  },
  njoftime: {
    title: "📢 Njoftimet",
    links: [
      { to: "/add-notification", label: "➕ Shto Njoftim" },
      { to: "/menaxho-notifications", label: "📊 Menaxho Njoftimet" },
    ],
  },
};

function PsikologSidePanel({ section, activePath }) {
  const navigate = useNavigate();
  const sectionData = SECTIONS[section] || { title: "", links: [] };
  const isLoggedIn = Boolean(
    localStorage.getItem("token") ||
      localStorage.getItem("user") ||
      localStorage.getItem("role") ||
      localStorage.getItem("psikologId") ||
      localStorage.getItem("patientId")
  );

  const getFallbackBackRoute = () => {
    if (section === "news") return "/menaxhoNews";
    if (section === "njoftime") return "/menaxho-notifications";
    return "/psikologDashboard";
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(getFallbackBackRoute());
  };

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{ width: "250px", position: "fixed", height: "100vh" }}
    >
      <div className="mb-3">
        <div className="text-white mb-2 px-2 py-1">
          <small
            className="text-uppercase fw-semibold"
            style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
          >
            {sectionData.title}
          </small>
        </div>

        {sectionData.links.map((link) => {
          const isActive = activePath === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link text-white px-3 py-2 mb-1"
              style={
                isActive
                  ? {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderRadius: "4px",
                    }
                  : { borderRadius: "4px" }
              }
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        {!isLoggedIn && (
          <Link to="/" className="btn btn-danger w-100 mb-2">
            🔐 Login
          </Link>
        )}
        <button
          onClick={handleBack}
          className="btn btn-secondary w-100"
        >
          ← Kthehu
        </button>
      </div>
    </div>
  );
}

export default PsikologSidePanel;
