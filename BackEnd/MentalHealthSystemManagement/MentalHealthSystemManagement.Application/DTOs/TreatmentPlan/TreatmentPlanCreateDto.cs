using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.DTOs.TreatmentPlan
{
    public class TreatmentPlanCreateDto
    {
        public int PatientId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string Goals { get; set; } = string.Empty;
    }
}
