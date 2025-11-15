using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.HealthReports
{
    public class CreateHealthReportDto
    {
        public int PsikologId { get; set; }
        public int PatientId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Diagnoza { get; set; } = string.Empty;
        public int? AppointmentId { get; set; }
    }
}
