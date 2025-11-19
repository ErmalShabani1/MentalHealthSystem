using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Domain.Entities
{
    public class TherapySession
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int PsikologId { get; set; }
        public DateTime SessionDate { get; set; }
        public int DurationMinutes { get; set; }
        public string SessionType { get; set; } = string.Empty; // Individual, Group, Family
        public string Notes { get; set; } = string.Empty;
        public string Progress { get; set; } = string.Empty;
        public string Goals { get; set; } = string.Empty;
        public string Exercises { get; set; } = string.Empty; // Ushtrimet që duhet të bëjë pacienti
        public string MoodBefore { get; set; } = string.Empty; // Gjendja emocionale para seancës
        public string MoodAfter { get; set; } = string.Empty; // Gjendja emocionale pas seancës
        public int SessionNumber { get; set; } = 1; // Numri i seancës për këtë pacient
        public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public Patient Patient { get; set; } = null!;
        public Psikologi Psikologi { get; set; } = null!;
    }
}
