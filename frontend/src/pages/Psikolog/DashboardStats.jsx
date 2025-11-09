function DashboardStats({ takimetCount, patientsCount }) {
  const stats = [
    { title: "Takimet Aktive", value: takimetCount, icon: "📅", color: "primary" },
    { title: "Pacientët Aktivë", value: patientsCount, icon: "🧑‍🤝‍🧑", color: "success" },
    { title: "Takimet e Ardhshme", value: "5", icon: "⏰", color: "info" },
  ];

  return (
    <div className="row mb-4">
      {stats.map((s, index) => (
        <div className="col-md-4 mb-3" key={index}>
          <div className={`card text-black bg-${s.color} shadow`}>
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
