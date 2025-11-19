using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.TherapySessions
{
    public class UpdateTherapySessionDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public DateTime SessionDate { get; set; }

        [Required]
        [Range(15, 300)]
        public int DurationMinutes { get; set; }

        [MaxLength(1000)]
        public string Notes { get; set; } = string.Empty;

        [MaxLength(200)]
        public string MoodAfter { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Goals { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Exercises { get; set; } = string.Empty;

        [MaxLength(200)]
        public string MoodBefore { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Status { get; set; } = "Scheduled";
    }
}
