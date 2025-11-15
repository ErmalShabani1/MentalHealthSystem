using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Domain.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public int PsikologId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = "Scheduled";
        public string Notes { get; set; } = string.Empty;

        public Psikologi Psikologi { get; set; } = null!;
        public Patient Patient { get; set; } = null!;

    }
}
