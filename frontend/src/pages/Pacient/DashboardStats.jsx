import React from "react";

function DashboardStats({ psychologistsCount }) {
  const stats = [
    { title: "Psikologët Aktivë", value: psychologistsCount, icon: "👨‍⚕️", color: "primary" },
    { title: "Takimet e mia", value: 12, icon: "📅", color: "info" },
  ];

  return (
    <div className="row mb-4">
      {stats.map((s, index) => (
        <div className="col-md-3 mb-3" key={index}>
          <div className={`card text-white bg-${s.color} shadow`}>
            <div className="card-body d-flex flex-column align-items-center">
              <h3>{s.icon}</h3>
              <h5 className="card-title mt-2">{s.title}</h5>
              <h4>{s.value}</h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;
