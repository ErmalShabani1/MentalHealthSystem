namespace MentalHealthSystemManagement.Application.DTOs.Appointments
{
    public class AppointmentReadDto
    {
        public int Id { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}
