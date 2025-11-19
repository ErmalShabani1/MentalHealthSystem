using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.TherapySessions
{
    public class TherapySessionDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public int PsikologId { get; set; }
        public string PsikologName { get; set; } = string.Empty;
        public DateTime SessionDate { get; set; }
        public int DurationMinutes { get; set; }
        public string SessionType { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string Progress { get; set; } = string.Empty;
        public string Goals { get; set; } = string.Empty;
        public string Exercises { get; set; } = string.Empty;
        public string MoodBefore { get; set; } = string.Empty;
        public string MoodAfter { get; set; } = string.Empty;
        public int SessionNumber { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
