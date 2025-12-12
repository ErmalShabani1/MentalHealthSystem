using System;
using System.ComponentModel.DataAnnotations;

namespace MentalHealthSystemManagement.Application.DTOs.Notifications
{
    public class CreateNotificationDto
    {
        [Required]
        public int PatientId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;
    }
}
