using System;
using System.ComponentModel.DataAnnotations;

namespace MentalHealthSystemManagement.Application.DTOs.Notifications
{
    public class UpdateNotificationDto
    {
        [Required]
        public int NotificationId { get; set; }

        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;
    }
}
