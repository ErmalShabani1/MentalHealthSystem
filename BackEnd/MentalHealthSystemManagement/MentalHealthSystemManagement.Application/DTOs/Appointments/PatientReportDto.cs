using System;
using System.Collections.Generic;

namespace MentalHealthSystemManagement.Application.DTOs.Appointments
{
    public class PatientReportDto
    {
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Mosha { get; set; }
        public string Gjinia { get; set; } = string.Empty;
        public string Diagnoza { get; set; } = string.Empty;
        public List<AppointmentNoteDto> Appointments { get; set; } = new List<AppointmentNoteDto>();
    }

    public class AppointmentNoteDto
    {
        public int AppointmentId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}

