using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Domain.Entities
{
    public class HealthReports
    {
        public int Id { get; set; }
        public int PsikologId { get; set; }
        public int PatientId { get; set; }
        public int? AppointmentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Diagnoza { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Psikologi Psikologi { get; set; }
        public Patient Patient { get; set; }
    }
}
