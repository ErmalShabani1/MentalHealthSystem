using System;

namespace MentalHealthSystemManagement.Application.DTOs.Notifications
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public int PsikologId { get; set; }
        public string PsikologName { get; set; } = string.Empty;
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime SentAt { get; set; }
        public DateTime? ReadAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
