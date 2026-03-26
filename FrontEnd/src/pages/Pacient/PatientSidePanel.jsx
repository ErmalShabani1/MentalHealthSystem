import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

const SECTION_CONFIG = {
  dashboard: {
    fallback: "/pacientDashboard",
    groups: [
      {
        title: "🏠 Paneli Kryesor",
        links: [{ to: "/pacientDashboard", label: "🏠 Dashboard" }],
      },
      {
        title: "📰 Lajmet",
        links: [{ to: "/newsList", label: "📖 Lexo këshilla" }],
      },
      {
        title: "📊 Raportet",
        links: [{ to: "/shfaqRaportet", label: "👁️ Raportet e mia" }],
      },
      {
        title: "📅 Takimet",
        links: [{ to: "/shfaqTakimet", label: "👁️ Takimet e mia" }],
      },
      {
        title: "💪 Ushtrimet",
        links: [{ to: "/shfaq-ushtrimet", label: "👁️ Ushtrimet" }],
      },
      {
        title: "🧘 Terapitë",
        links: [{ to: "/shfaqTerapine", label: "👁️ Terapitë" }],
      },
      {
        title: "📋 Planet",
        links: [{ to: "/shfaq-treatmentplan", label: "👁️ Planet e trajtimit" }],
      },
      {
        title: "👨‍⚕️ Psikologët",
        links: [{ to: "/shfaqPsikologet", label: "👁️ Psikologët" }],
      },
      {
        title: "🔔 Njoftimet",
        links: [{ to: "/my-notifications", label: "📬 Njoftimet e mia" }],
      },
    ],
  },
  news: {
    title: "📰 Lajmet",
    fallback: "/newsList",
    links: [{ to: "/newsList", label: "📖 Lexo këshilla" }],
  },
  raporte: {
    title: "📊 Raportet",
    fallback: "/shfaqRaportet",
    links: [{ to: "/shfaqRaportet", label: "👁️ Raportet e mia" }],
  },
  takime: {
    title: "📅 Takimet",
    fallback: "/shfaqTakimet",
    links: [{ to: "/shfaqTakimet", label: "👁️ Takimet e mia" }],
  },
  terapi: {
    title: "🧘 Terapitë",
    fallback: "/shfaqTerapine",
    links: [{ to: "/shfaqTerapine", label: "🧘 Terapitë e mia" }],
  },
  ushtrime: {
    title: "💪 Ushtrimet",
    fallback: "/shfaq-ushtrimet",
    links: [{ to: "/shfaq-ushtrimet", label: "💪 Ushtrimet e mia" }],
  },
  treatmentPlan: {
    title: "📋 Planet e Trajtimit",
    fallback: "/shfaq-treatmentplan",
    links: [{ to: "/shfaq-treatmentplan", label: "📋 Planet e mia" }],
  },
  psikologet: {
    title: "👨‍⚕️ Psikologët",
    fallback: "/shfaqPsikologet",
    links: [{ to: "/shfaqPsikologet", label: "👨‍⚕️ Psikologët" }],
  },
  notifications: {
    title: "🔔 Njoftimet",
    fallback: "/my-notifications",
    links: [{ to: "/my-notifications", label: "📬 Njoftimet e mia" }],
  },
};

function PatientSidePanel({ section, activePath, linkBadges = {} }) {
  const navigate = useNavigate();
  const selectedSections = Array.isArray(section) ? section : [section];
  const resolvedConfigs = selectedSections
    .map((key) => SECTION_CONFIG[key])
    .filter(Boolean);

  const groups = resolvedConfigs.flatMap((config) => {
    if (config.groups) {
      return config.groups;
    }
    return [
      {
        title: config.title,
        links: config.links || [],
      },
    ];
  });

  const fallbackRoute =
    resolvedConfigs.find((config) => config.fallback)?.fallback ||
    groups.find((group) => group.links && group.links.length)?.links[0]?.to ||
    "/pacientDashboard";

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackRoute);
  };

  const isLoggedIn = Boolean(
    localStorage.getItem("token") ||
      localStorage.getItem("user") ||
      localStorage.getItem("role") ||
      localStorage.getItem("psikologId") ||
      localStorage.getItem("patientId")
  );

  if (!groups.length) {
    return null;
  }

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{ width: "240px", position: "fixed", height: "100vh", overflowY: "auto" }}
    >
      {groups.map((group, index) => (
        <div key={`${group.title || "group"}-${index}`} className="mb-2">
          {group.title && (
            <div className="text-white mb-1 px-1 py-1">
              <small className="text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                {group.title}
              </small>
            </div>
          )}
          {(group.links || []).map((link) => {
            const isActive = activePath === link.to;
            const badgeValue = linkBadges[link.to];

            return (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link text-white px-2 py-1 mb-1 d-flex align-items-center justify-content-between"
                style={
                  isActive
                    ? { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px", fontSize: "0.85rem" }
                    : { borderRadius: "4px", fontSize: "0.85rem" }
                }
              >
                <span>{link.label}</span>
                {typeof badgeValue === "number" && badgeValue > 0 && (
                  <span className="badge bg-danger rounded-pill" style={{ fontSize: "0.7rem", minWidth: "28px" }}>
                    {badgeValue}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      <div className="mt-auto pt-3 border-top">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
            🚪 Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-danger w-100 mb-2">
            🔐 Login
          </Link>
        )}
        <button onClick={handleBack} className="btn btn-secondary w-100">
          ← Kthehu
        </button>
      </div>
    </div>
  );
}

export default PatientSidePanel;
