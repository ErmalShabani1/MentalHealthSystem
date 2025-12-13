using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.Appointments
{
    public class UpdateAppointmentDto
    {
        public int PatientId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = "Scheduled";
    }
}
